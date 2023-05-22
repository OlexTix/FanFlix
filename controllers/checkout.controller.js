require("dotenv").config();
const Pool = require("pg").Pool;

// Read variables from .env file
const DATABASE_USER_NAME = process.env.DATABASE_USER_NAME;
const DATABASE_HOST_NAME = process.env.DATABASE_HOST_NAME;
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_PORT = process.env.DATABASE_PORT;

// Create DATABASE_LINK using variables from .env file
const DATABASE_LINK = `postgres://${DATABASE_USER_NAME}:${DATABASE_PASSWORD}@${DATABASE_HOST_NAME}:${DATABASE_PORT}/${DATABASE_NAME}?options=-c search_path=public`;

const connectionString = DATABASE_LINK;

const poolDB = new Pool({
  connectionString,
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const processCheckout = async (req, res) => {
  console.log('1. Request received');

  const ticketData = req.query.ticketData;
  console.log('2. ticketData:', ticketData);

  if (!ticketData) {
    return res.status(400).json({ error: "ticketData parameter is missing from the request." });
  }

  let ticketArray;
  try {
    ticketArray = JSON.parse(ticketData);
  } catch (err) {
    return res.status(400).json({ error: "Unable to parse ticketData parameter. Invalid format." });
  }
  console.log('3. ticketArray:', ticketArray);

  var tickets = null;
  try {
    const { rows } = await poolDB.query(`SELECT * FROM "Ticket_Type"`);
    tickets = rows;
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error occurred while fetching ticket types from the database." });
  }
  console.log('4. tickets:', tickets);

  const lineItems = ticketArray.tickets.flatMap((ticket) => {
    const ticketId = parseInt(ticket.id);
    const quantity = parseInt(ticket.quantity);
    console.log('5. ticketId:', ticketId, 'quantity:', quantity);

    if (isNaN(quantity) || isNaN(ticketId) || quantity <= 0) {
      return [];
    }

    const filteredTickets = tickets.filter((item) => item.id_ticket_type === ticketId);
    console.log('6. filteredTickets:', filteredTickets);

    return filteredTickets.map((item) => {
      return {
        price: item.stripePriceId,
        quantity: quantity,
      };
    });
  });
  console.log('7. lineItems:', lineItems);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `https://fanflix.fantasticstudio.online/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://fanflix.fantasticstudio.online/`,
      metadata: {
        ticketData: JSON.stringify(ticketArray.tickets),
        seats: JSON.stringify(req.query.seats),
        screeningID: req.query.screeningID,
      },
    });
    console.log('8. session created:', session);
    return res.send({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error occurred while creating the checkout session." });
  }
};

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  
  // Log the stripe-signature
  console.log("Stripe-signature:", sig);
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Error constructing event from Stripe webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const ticketArray = JSON.parse(session.metadata.ticketData);
    const seats = JSON.parse(session.metadata.seats);
    const screeningID = session.metadata.screeningID;

    try {
      await insertTickets(ticketArray, seats, screeningID);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  res.status(200).send("Webhook received");
};

const decodeSeatToId = async (row, seat_number) => {
  try {
    const seatQuery = `SELECT id_seat FROM "Seat" WHERE row = $1 AND seat_number = $2 AND status = 2 LIMIT 1`;
    const { rows } = await poolDB.query(seatQuery, [row, seat_number]);

    if (rows.length === 0) {
      throw new Error(`No available seat found for row ${row} and seat number ${seat_number}`);
    }

    return rows[0].id_seat;
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to decode seat row ${row} and number ${seat_number} to id.`);
  }
};

const insertTickets = async (ticketArray, seats, screeningID) => {
  for (let i = 0; i < ticketArray.length; i++) {
    const ticket = ticketArray[i];
    const ticketId = parseInt(ticket.id);
    const quantity = parseInt(ticket.quantity);

    if (isNaN(quantity) || isNaN(ticketId)) {
      continue;
    }

    for (let j = 0; j < seats.length && j < quantity; j++) {
      const seat = seats[j];
      const row = seat.substring(0, 1);
      const seat_number = parseInt(seat.substring(1));
      const id_seat = await decodeSeatToId(row, seat_number);

      const insertQuery = `INSERT INTO "Ticket" (id_screening, id_seat, id_ticket_type, quantity) VALUES (${screeningID}, ${id_seat}, ${ticketId}, 1)`;
      try {
        await poolDB.query(insertQuery);
      } catch (err) {
        console.error(err);
        throw new Error(`Failed to insert ticket for screening ID ${screeningID}, seat ID ${id_seat}, and ticket type ${ticketId}.`);
      }
    }
  }
};

module.exports = {
  processCheckout,
  handleStripeWebhook,
  decodeSeatToId,
  insertTickets
};