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

const addHall = async (req, res) => {
  const cinemaId = parseInt(req.params.id);
  const { hall_number, number_of_seats } = req.body;
  const client = await poolDB.connect();

  try {
    // Check if cinema exists
    const { rows } = await client.query(
      'SELECT * FROM "Cinema" WHERE id_cinema = $1',
      [cinemaId]
    );

    if (rows.length === 0) {
      res.status(404).send({ message: "Cinema not found" });
      return;
    }

    // Insert new hall associated with cinema
    const { rowCount } = await client.query(
      'INSERT INTO "Cinema_Hall" (id_cinema, hall_number, number_of_seats) VALUES ($1, $2, $3)',
      [cinemaId, hall_number, number_of_seats]
    );

    res.status(201).send({ message: "New hall added successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to add new hall" });
  } finally {
    client.release();
  }
};

const getHalls = async (req, res) => {
  const cinemaName = req.params.name;
  const client = await poolDB.connect();
  const { hall_number, number_of_seats } = req.query;
  let selectColumns = '*';

  if (Object.keys(req.query).length === 1) {
    if ('hall_number' in req.query && !hall_number) {
      selectColumns = 'cinema_hall.hall_number';
    } else if ('number_of_seats' in req.query && !number_of_seats) {
      selectColumns = 'cinema_hall.number_of_seats';
    }
  }

  let query = `SELECT ${selectColumns} FROM "Cinema_Hall" AS cinema_hall INNER JOIN "Cinema" AS cinema ON cinema.id_cinema = cinema_hall.id_cinema WHERE cinema.name = $1`;
  const queryParams = [cinemaName];
  let queryConditions = '';



  if (hall_number) {
    queryParams.push(hall_number);
    queryConditions += ` AND cinema_hall.hall_number = $${queryParams.length}`;
  }

  if (number_of_seats) {
    queryParams.push(number_of_seats);
    queryConditions += ` AND cinema_hall.number_of_seats = $${queryParams.length}`;
  }

  if (queryConditions) {
    query += queryConditions;
  }

  try {
    const { rows: hallRows } = await client.query(query, queryParams);

    if (hallRows.length === 0) {
      res.status(404).send({ message: "Halls not found" });
    } else {
      res.status(200).json(hallRows);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to get halls" });
  } finally {
    client.release();
  }
};



const getHallByHallNumber = async (req, res) => {
  const cinemaName = req.params.name;
  const hallNumber = parseInt(req.params.hallNumber);
  const client = await poolDB.connect();

  try {
    // Check if cinema exists
    const { rows: cinemaRows } = await client.query(
      'SELECT * FROM "Cinema" WHERE name = $1',
      [cinemaName]
    );

    if (cinemaRows.length === 0) {
      res.status(404).send({ message: "Cinema not found" });
      return;
    }

    const cinemaId = cinemaRows[0].id_cinema;

    // Get hall by hall_number associated with cinema
    const { rows: hallRows } = await client.query(
      'SELECT * FROM "Cinema_Hall" WHERE id_cinema = $1 AND hall_number = $2',
      [cinemaId, hallNumber]
    );

    if (hallRows.length === 0) {
      res.status(404).send({ message: "Hall not found" });
      return;
    }

    res.status(200).json(hallRows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to get hall" });
  } finally {
    client.release();
  }
};
  

const updateHallsData = async (req, res) => {
  const cinemaId = parseInt(req.params.id);
  const hallId = parseInt(req.params.hallId);
  const { hall_number, number_of_seats } = req.body;
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

    // Check if hall exists and retrieve current data
    const { rows: hallRows } = await client.query(
      'SELECT * FROM "Cinema_Hall" WHERE id_cinema = $1 AND id_cinema_hall = $2',
      [cinemaId, hallId]
    );

    if (hallRows.length === 0) {
      res.status(404).send({ message: "Hall not found" });
      return;
    }

    const currentHallData = hallRows[0];

    // Update hall data if provided in request body
    const newHallData = {
      hall_number: hall_number || currentHallData.hall_number,
      number_of_seats: number_of_seats || currentHallData.number_of_seats,
    };

    const { rowCount } = await client.query(
      'UPDATE "Cinema_Hall" SET hall_number = $1, number_of_seats = $2 WHERE id_cinema = $3 AND id_cinema_hall = $4',
      [newHallData.hall_number, newHallData.number_of_seats, cinemaId, hallId]
    );

    if (rowCount === 0) {
      res.status(500).send({ message: "Failed to update hall data" });
      return;
    }

    res.status(200).send({ message: "Hall data updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to update hall data" });
  } finally {
    client.release();
  }
};

const deleteHall = async (req, res) => {
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

    // Start transaction
    await client.query("BEGIN");

    // Delete associated seats
    await client.query('DELETE FROM "Seat" WHERE id_cinema_hall = $1', [
      hallId,
    ]);

    // Delete hall
    const { rowCount } = await client.query(
      'DELETE FROM "Cinema_Hall" WHERE id_cinema = $1 AND id_cinema_hall = $2',
      [cinemaId, hallId]
    );

    if (rowCount === 0) {
      await client.query("ROLLBACK");
      res.status(500).send({ message: "Failed to delete hall" });
      return;
    }

    // Commit transaction
    await client.query("COMMIT");

    res.status(200).send({ message: "Hall deleted successfully" });
  } catch (err) {
    // Rollback transaction on error
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).send({ message: "Failed to delete hall" });
  } finally {
    client.release();
  }
};

module.exports = {
  addHall,
  getHalls,
  getHallByHallNumber,
  updateHallsData,
  deleteHall,
};
