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

const getTicketTypes = async (req, res) => {
  try {
    const { rows } = await poolDB.query(`SELECT * FROM "Ticket_Type"`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const saveSelectedTicketTypes = (req, res) => {
  try {
    req.session.selected_ticket_types = req.body.selected_ticket_types;
    req.session.selected_ticket_types_quantity = req.body.selected_ticket_types_quantity;
    res.status(200).json({ message: "Selected ticket types and quantity saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getTicketTypes,
  saveSelectedTicketTypes,
};