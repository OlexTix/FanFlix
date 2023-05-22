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

const addSeatsToHall = async (req, res) => {
    const hallNumber = req.params.hallNumber;
    const seats = req.body.seats;
  
    const client = await poolDB.connect();
  
    try {
      const { rows: hallRows } = await client.query(
        'SELECT id_cinema_hall FROM "Cinema_Hall" WHERE hall_number = $1',
        [hallNumber]
      );
  
      if (hallRows.length === 0) {
        res.status(404).send({ message: "Cinema hall not found" });
        return;
      }
  
      const id_cinema_hall = hallRows[0].id_cinema_hall;
  
      const existingSeats = [];
      const newSeats = [];
  
      for (const seat of Object.values(seats)) {
        const { rows: seatRows } = await client.query(
          'SELECT * FROM "Seat" WHERE id_cinema_hall = $1 AND row = $2 AND seat_number = $3',
          [id_cinema_hall, seat.row, seat.seat_number]
        );
  
        if (seatRows.length > 0) {
          existingSeats.push(seat);
        } else {
          newSeats.push(seat);
        }
      }
  
      if (existingSeats.length > 0) {
        res.status(400).send({ message: "Some seats already exist", seats: existingSeats });
        return;
      }
  
      for (const seat of newSeats) {
        await client.query(
          'INSERT INTO "Seat" (id_cinema_hall, row, seat_number, status) VALUES ($1, $2, $3, $4)',
          [id_cinema_hall, seat.row, seat.seat_number, seat.status]
        );
      }
  
      res.status(200).send({ message: "Seats added successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: "Failed to add seats" });
    } finally {
      client.release();
    }
  };
  
  module.exports = {
    addSeatsToHall,
  };