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


const getHalls = async (req, res) => {
  const cinemaName = req.params.name;
  const client = await poolDB.connect();
  const { hall_number, number_of_seats } = req.query;
  let selectColumns = "*";

  if (Object.keys(req.query).length === 1) {
    if ("hall_number" in req.query && !hall_number) {
      selectColumns = "cinema_hall.hall_number";
    } else if ("number_of_seats" in req.query && !number_of_seats) {
      selectColumns = "cinema_hall.number_of_seats";
    }
  }

  let query = `SELECT ${selectColumns} FROM "Cinema_Hall" AS cinema_hall INNER JOIN "Cinema" AS cinema ON cinema.id_cinema = cinema_hall.id_cinema WHERE cinema.name = $1`;
  const queryParams = [cinemaName];
  let queryConditions = "";

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



module.exports = {
  getHalls,
  getHallByHallNumber,
};