require("dotenv").config();
const Pool = require("pg").Pool;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const DATABASE_USER_NAME = process.env.DATABASE_USER_NAME;
const DATABASE_HOST_NAME = process.env.DATABASE_HOST_NAME;
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_PORT = process.env.DATABASE_PORT;

const DATABASE_LINK = `postgres://${DATABASE_USER_NAME}:${DATABASE_PASSWORD}@${DATABASE_HOST_NAME}:${DATABASE_PORT}/${DATABASE_NAME}?options=-c search_path=public`;

const connectionString = DATABASE_LINK;

const poolDB = new Pool({
  connectionString,
});

const processCheckout = async (req, res) => {
  try {
    console.log("1. Request received at", new Date().toLocaleString());

    const ticketData = req.query.ticketData;
    console.log("2. ticketData:", ticketData);

    if (!ticketData) {
      return res
        .status(400)
        .json({ error: "ticketData parameter is missing from the request." });
    }

    let ticketArray;
    try {
      ticketArray = JSON.parse(ticketData);
    } catch (err) {
      console.error("Error parsing ticketData:", err);
      return res
        .status(401)
        .json({
          error: "Unable to parse ticketData parameter. Invalid format.",
        });
    }
    console.log("3. ticketArray:", ticketArray);

    var tickets = null;
    try {
      const { rows } = await poolDB.query(`SELECT * FROM "Ticket_Type"`);
      tickets = rows;
    } catch (err) {
      console.error("Error fetching ticket types:", err);
      return res
        .status(500)
        .json({
          error:
            "Error occurred while fetching ticket types from the database.",
        });
    }
    console.log("4. tickets:", tickets);

    const lineItems = ticketArray.flatMap((ticket) => {
      const ticketId = parseInt(ticket.id);
      const quantity = parseInt(ticket.quantity);
      console.log("5. ticketId:", ticketId, "quantity:", quantity);

      if (isNaN(quantity) || isNaN(ticketId) || quantity <= 0) {
        return [];
      }

      const filteredTickets = tickets.filter(
        (item) => item.id_ticket_type === ticketId
      );
      console.log("6. filteredTickets:", filteredTickets);

      if (!filteredTickets.length) {
        console.error(
          "Error: No matching tickets found for ticketId:",
          ticketId
        );
      }

      return filteredTickets.map((item) => {
        return {
          price: item.stripePriceId,
          quantity: quantity,
        };
      });
    });
    console.log("7. lineItems:", lineItems);

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        success_url: `https://fanflix.fantasticstudio.online/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://fanflix.fantasticstudio.online/`,
        metadata: {
          ticketData: JSON.stringify(ticketArray),
          seats: JSON.stringify(req.query.seats),
          screeningID: req.query.screeningID,
        },
      });
      console.log("8. session created:", session);
      // Call the test webhook here
      await testStripeWebhook();

      return res.send({ url: session.url });
    } catch (err) {
      console.error("Error creating checkout session:", err);
      return res
        .status(501)
        .json({ error: "Error occurred while creating the checkout session." });
    }
  } catch (error) {
    console.error("Error in processCheckout:", error);
    res.status(502).json({ error: "Internal server error" });
  }
};

// This function will be triggered during checkout for testing
const testStripeWebhook = async () => {
  try {
    // Define the payload for the test event
    const payload = {
      id: 'evt_test_webhook',
      object: 'event',
    };
  
    // Stringify the payload
    const payloadString = JSON.stringify(payload, null, 2);
    // Your Stripe webhook secret for testing
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    console.log("Stripe webhook secret: " + secret);
  
    // Generate the header for the test event
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });
  
    // Construct the event
    const event = stripe.webhooks.constructEvent(payloadString, header, secret);
  
    // Log the event details
    console.log('Test event created:', event);
  
    // Do something with the mocked signed event
    // Here, you can add the code to handle the event as you wish, similar to what you did in handleStripeWebhook
    if (event.id === payload.id) {
      console.log('Test Event ID matches the payload ID');
      // Process the event...
    } else {
      console.log('Test Event ID does not match the payload ID');
    }
  } catch (err) {
    console.error('Test Error in testStripeWebhook:', err);
  }
};
const handleStripeWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const body = req.body.toString();

    console.log("Raw request body:", body); // print the raw body
    console.log("Stripe-Signature:", sig); // print the signature
    console.log("STRIPE_WEBHOOK_SECRET:", process.env.STRIPE_WEBHOOK_SECRET);

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(
        `Error constructing event from Stripe webhook: ${err.message}`
      );
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const ticketArray = JSON.parse(session.metadata.ticketData);
      const seats = JSON.parse(session.metadata.seats);
      const screeningID = session.metadata.screeningID;

      const stripeTransactionId = session.payment_intent;
      console.log(stripeTransactionId);
      const stripeSessionId = session.id;
      console.log(stripeSessionId);

      try {
        await insertTickets(
          ticketArray,
          seats,
          screeningID,
          stripeTransactionId,
          stripeSessionId
        );
      } catch (err) {
        console.error(err);
        return res.status(503).json({ error: "Internal server error" });
      }
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error in handleStripeWebhook:", error);
    res.status(504).json({ error: "Internal server error" });
  }
};

const decodeSeatToId = async (row, seat_number) => {
  try {
    const seatQuery = `SELECT id_seat FROM "Seat" WHERE row = $1 AND seat_number = $2 AND status = 2 LIMIT 1`;
    const { rows } = await poolDB.query(seatQuery, [row, seat_number]);

    if (rows.length === 0) {
      throw new Error(
        `No available seat found for row ${row} and seat number ${seat_number}`
      );
    }

    return rows[0].id_seat;
  } catch (err) {
    console.error("Error in decodeSeatToId:", err);
    throw new Error(
      `Failed to decode seat row ${row} and number ${seat_number} to id.`
    );
  }
};

const insertTickets = async (
  ticketArray,
  seats,
  screeningID,
  stripeTransactionId,
  stripeSessionId
) => {
  try {
    for (let i = 0; i < ticketArray.length; i++) {
      const ticket = ticketArray[i];
      const ticketId = parseInt(ticket.id);
      const quantity = parseInt(ticket.quantity);

      if (isNaN(quantity) || isNaN(ticketId)) {
        console.log(
          `Skipping ticket due to invalid ID (${ticket.id}) or quantity (${ticket.quantity})`
        );
        continue;
      }

      for (let j = 0; j < seats.length && j < quantity; j++) {
        const seat = seats[j];
        const row = seat.substring(0, 1);
        const seat_number = parseInt(seat.substring(1));
        let id_seat;

        try {
          id_seat = await decodeSeatToId(row, seat_number);
        } catch (error) {
          console.error(
            `Failed to decode seat ID for row ${row} and seat number ${seat_number}:`,
            error
          );
          continue;
        }

        const insertQuery = `INSERT INTO "Ticket" (id_screening, id_seat, id_ticket_type, quantity, stripe_transaction_id, stripe_checkout_session_id) VALUES ($1, $2, $3, $4, $5, $6)`;
        try {
          await poolDB.query(insertQuery, [
            screeningID,
            id_seat,
            ticketId,
            1,
            stripeTransactionId,
            stripeSessionId,
          ]);
        } catch (err) {
          console.error(
            `Failed to insert ticket for screening ID ${screeningID}, seat ID ${id_seat}, and ticket type ${ticketId}:`,
            err
          );
          throw new Error(
            `Failed to insert ticket for screening ID ${screeningID}, seat ID ${id_seat}, and ticket type ${ticketId}.`
          );
        }
      }
    }
  } catch (error) {
    console.error("Error in insertTickets:", error);
    throw new Error("Failed to insert tickets.");
  }
};

module.exports = {
  processCheckout,
  handleStripeWebhook,
  decodeSeatToId,
  insertTickets,
};
