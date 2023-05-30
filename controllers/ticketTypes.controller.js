require("dotenv").config();
const poolDB = require('../db/db.js');

const getTicketTypes = async (req, res) => {
  try {
    const { rows } = await poolDB.query(`SELECT * FROM "Ticket_Type"`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getTicketTypes
};