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
    const ticketData = req.query.ticketData;
  
    if (!ticketData) {
      return res.status(400).json({ error: "ticketData parameter must be provided" });
    }
  
    let ticketArray;
    try {
      ticketArray = JSON.parse(ticketData);
    } catch (err) {
      return res.status(400).json({ error: "Invalid ticketData parameter" });
    }
  
    var tickets = null;
  
    try {
      const { rows } = await poolDB.query(`SELECT * FROM "Ticket_Type"`);
      tickets = rows;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  
    const lineItems = ticketArray.flatMap((ticket) => {
      const ticketId = parseInt(ticket.id_ticket);
      const quantity = parseInt(ticket.quantity);
  
      if (isNaN(quantity) || isNaN(ticketId)) {
        return [];
      }
  
      const filteredTickets = tickets.filter((item) => item.id_ticket_type === ticketId);
  
      return filteredTickets.map((item) => {
        return {
          price: item.stripePriceId,
          quantity: quantity,
        };
      });
    });
  
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `https://fanflix.fantasticstudio.online/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://fanflix.fantasticstudio.online/`,
    });
  
    return res.send({ url: session.url });
};

module.exports = {
  processCheckout,
};