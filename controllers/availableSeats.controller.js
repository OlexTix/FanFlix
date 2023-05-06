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

const getAvailableSeats = async (req, res) => {
    const { name, screeningName } = req.params;
  
    if (!name || !screeningName) {
      return res.status(400).json({ error: "Missing required information" });
    }
  
    try {
      // Check if cinema exists
      const cinemaResult = await poolDB.query(
        `SELECT * FROM "Cinema" WHERE name = $1`,
        [name]
      );
  
      if (cinemaResult.rowCount === 0) {
        return res.status(404).json({ error: "Cinema not found" });
      }
  
      // Check if screening exists
      const screeningResult = await poolDB.query(
        `SELECT * FROM "Screening" WHERE name = $1 AND id_cinema = $2`,
        [screeningName, cinemaResult.rows[0].id_cinema]
      );
  
      if (screeningResult.rowCount === 0) {
        return res.status(404).json({ error: "Screening not found" });
      }
  
      // Get available seats
      const { rows } = await poolDB.query(
        `SELECT * FROM "Seat" WHERE id_cinema_hall IN (
          SELECT id_cinema_hall FROM "Screening" WHERE id_screening = $1
        ) AND id_seat NOT IN (
          SELECT id_seat FROM "Ticket" WHERE id_screening = $1
        )`,
        [screeningResult.rows[0].id_screening]
      );
  
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  const saveSelectedSeats = (req, res) => {
    try {
      req.session.selected_seats = req.body.selected_seats;
      res.status(200).json({ message: "Selected seats saved" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  module.exports = {
    getAvailableSeats,
    saveSelectedSeats,
  };