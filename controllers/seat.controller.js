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

const addSeat = async (req, res) => {
  const cinemaId = parseInt(req.params.id);
  const hallId = parseInt(req.params.hallId);
  const { row, seat_number } = req.body;
  const client = await poolDB.connect();

  try {
    // Check if cinema exists
    const { rows: cinemaRows } = await client.query(
      'SELECT * FROM "Cinema" WHERE id_cinema = $1',
      [cinemaId]
    );

    if (cinemaRows.length === 0) {
      res.status(404).send({ message: "Cinema not found" });
      return;
    }

    // Check if hall exists
    const { rows: hallRows } = await client.query(
      'SELECT * FROM "Cinema_Hall" WHERE id_cinema = $1 AND id_cinema_hall = $2',
      [cinemaId, hallId]
    );

    if (hallRows.length === 0) {
      res.status(404).send({ message: "Hall not found" });
      return;
    }

    // Insert new seat associated with hall
    const { rowCount } = await client.query(
      'INSERT INTO "Seat" (id_cinema_hall, row, seat_number) VALUES ($1, $2, $3)',
      [hallId, row, seat_number]
    );

    res.status(201).send({ message: "New seat added successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to add new seat" });
  } finally {
    client.release();
  }
};

const getSeats = async (req, res) => {
  const cinemaName = req.params.name;
  const hallNumber = parseInt(req.params.hallNumber);
  const client = await poolDB.connect();

  const { row, seat_number } = req.query;
  let selectColumns = "seat.row, seat.seat_number";

  if (Object.keys(req.query).length === 1) {
    if ("row" in req.query && !row) {
      selectColumns = "seat.row";
    } else if ("seat_number" in req.query && !seat_number) {
      selectColumns = "seat.seat_number";
    }
  }

  let query = `SELECT ${selectColumns} FROM "Seat" AS seat
               INNER JOIN "Cinema_Hall" AS cinema_hall ON seat.id_cinema_hall = cinema_hall.id_cinema_hall
               INNER JOIN "Cinema" AS cinema ON cinema_hall.id_cinema = cinema.id_cinema
               WHERE cinema_hall.hall_number = $1 AND cinema.name = $2`;
  const queryParams = [hallNumber, cinemaName];
  let queryConditions = "";

  if (row) {
    queryParams.push(row);
    queryConditions += ` AND seat.row = $${queryParams.length}`;
  }

  if (seat_number) {
    queryParams.push(seat_number);
    queryConditions += ` AND seat.seat_number = $${queryParams.length}`;
  }

  if (queryConditions) {
    query += queryConditions;
  }

  try {
    const { rows: seatRows } = await client.query(query, queryParams);

    if (seatRows.length === 0) {
      res.status(404).send({ message: "Seats not found" });
    } else {
      res.status(200).json(seatRows);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to get seats" });
  } finally {
    client.release();
  }
};

const getSeatById = async (req, res) => {
  const cinemaName = req.params.name;
  const hallNumber = parseInt(req.params.hallNumber);
  const seatNumber = parseInt(req.params.seatNumber);
  const client = await poolDB.connect();

  try {
    // Get cinema and hall id
    const { rows: cinemaHallRows } = await client.query(
      `SELECT cinema.id_cinema, cinema_hall.id_cinema_hall FROM "Cinema" AS cinema
       INNER JOIN "Cinema_Hall" AS cinema_hall ON cinema.id_cinema = cinema_hall.id_cinema
       WHERE cinema.name = $1 AND cinema_hall.hall_number = $2`,
      [cinemaName, hallNumber]
    );

    if (cinemaHallRows.length === 0) {
      res.status(404).send({ message: "Cinema or hall not found" });
      return;
    }

    const cinemaId = cinemaHallRows[0].id_cinema;
    const hallId = cinemaHallRows[0].id_cinema_hall;

    // Get seat by seatNumber associated with hall
    const { rows: seatRows } = await client.query(
      `SELECT seat.* FROM "Seat" AS seat
       INNER JOIN "Cinema_Hall" AS cinema_hall ON seat.id_cinema_hall = cinema_hall.id_cinema_hall
       WHERE cinema_hall.id_cinema_hall = $1 AND seat.seat_number = $2`,
      [hallId, seatNumber]
    );

    if (seatRows.length === 0) {
      res.status(404).send({ message: "Seat not found" });
      return;
    }

    // Send only the row and seat_number as the response
    res.status(200).json({
      row: seatRows[0].row,
      seat_number: seatRows[0].seat_number,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to get seat" });
  } finally {
    client.release();
  }
};

const updateSeatData = async (req, res) => {
  const cinemaId = parseInt(req.params.id);
  const hallId = parseInt(req.params.hallId);
  const seatId = parseInt(req.params.seatId);
  const { row, seat_number } = req.body;
  const client = await poolDB.connect();

  try {
    // Check if cinema exists
    const { rows: cinemaRows } = await client.query(
      'SELECT * FROM "Cinema" WHERE id_cinema = $1',
      [cinemaId]
    );

    if (cinemaRows.length === 0) {
      res.status(404).send({ message: "Cinema not found" });
      return;
    }

    // Check if hall exists
    const { rows: hallRows } = await client.query(
      'SELECT * FROM "Cinema_Hall" WHERE id_cinema = $1 AND id_cinema_hall = $2',
      [cinemaId, hallId]
    );

    if (hallRows.length === 0) {
      res.status(404).send({ message: "Hall not found" });
      return;
    }

    // Check if seat exists and retrieve current data
    const { rows: seatRows } = await client.query(
      'SELECT * FROM "Seat" WHERE id_cinema_hall = $1 AND id_seat = $2',
      [hallId, seatId]
    );

    if (seatRows.length === 0) {
      res.status(404).send({ message: "Seat not found" });
      return;
    }

    const currentSeatData = seatRows[0];

    // Update seat data if provided in request body
    const newSeatData = {
      row: row || currentSeatData.row,
      seat_number: seat_number || currentSeatData.seat_number,
    };

    const { rowCount } = await client.query(
      'UPDATE "Seat" SET row = $1, seat_number = $2 WHERE id_cinema_hall = $3 AND id_seat = $4',
      [newSeatData.row, newSeatData.seat_number, hallId, seatId]
    );

    if (rowCount === 0) {
      res.status(500).send({ message: "Failed to update seat data" });
      return;
    }

    res.status(200).send({ message: "Seat data updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to update seat data" });
  } finally {
    client.release();
  }
};

const deleteSeat = async (req, res) => {
  const cinemaId = parseInt(req.params.id);
  const hallId = parseInt(req.params.hallId);
  const seatId = parseInt(req.params.seatId);
  const client = await poolDB.connect();

  try {
    // Check if cinema exists
    const { rows: cinemaRows } = await client.query(
      'SELECT * FROM "Cinema" WHERE id_cinema = $1',
      [cinemaId]
    );

    if (cinemaRows.length === 0) {
      res.status(404).send({ message: "Cinema not found" });
      return;
    }

    // Check if hall exists
    const { rows: hallRows } = await client.query(
      'SELECT * FROM "Cinema_Hall" WHERE id_cinema = $1 AND id_cinema_hall = $2',
      [cinemaId, hallId]
    );

    if (hallRows.length === 0) {
      res.status(404).send({ message: "Hall not found" });
      return;
    }

    // Check if seat exists
    const { rows: seatRows } = await client.query(
      'SELECT * FROM "Seat" WHERE id_cinema_hall = $1 AND id_seat = $2',
      [hallId, seatId]
    );

    if (seatRows.length === 0) {
      res.status(404).send({ message: "Seat not found" });
      return;
    }

    // Delete seat by id
    const { rowCount } = await client.query(
      'DELETE FROM "Seat" WHERE id_cinema_hall = $1 AND id_seat = $2',
      [hallId, seatId]
    );

    if (rowCount === 0) {
      res.status(500).send({ message: "Failed to delete seat" });
      return;
    }

    res.status(200).send({ message: "Seat deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to delete seat" });
  } finally {
    client.release();
  }
};

module.exports = {
  addSeat,
  getSeats,
  getSeatById,
  updateSeatData,
  deleteSeat,
};
