require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
const { oleCheckJWT } = require("../middleware");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_LINK;
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
  const cinemaId = parseInt(req.params.id);
  const hallId = parseInt(req.params.hallId);
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

    // Get all seats associated with hall
    const { rows: seatRows } = await client.query(
      'SELECT * FROM "Seat" WHERE id_cinema_hall = $1',
      [hallId]
    );

    res.status(200).json(seatRows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to get seats" });
  } finally {
    client.release();
  }
};

const getSeatById = async (req, res) => {
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

    // Get seat by id associated with hall
    const { rows: seatRows } = await client.query(
      'SELECT * FROM "Seat" WHERE id_cinema_hall = $1 AND id_seat = $2',
      [hallId, seatId]
    );

    if (seatRows.length === 0) {
      res.status(404).send({ message: "Seat not found" });
      return;
    }

    res.status(200).json(seatRows[0]);
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
