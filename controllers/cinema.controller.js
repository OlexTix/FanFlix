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

const getCinemasList = async (req, res) => {
  const client = await poolDB.connect();
  const { name, street, city } = req.query;
  let selectColumns = "*";

  if (Object.keys(req.query).length === 1) {
    if ("name" in req.query && !name) {
      selectColumns = "cinema.name";
    } else if ("street" in req.query && !street) {
      selectColumns = "address.street";
    } else if ("city" in req.query && !city) {
      selectColumns = "address.city";
    }
  }

  let query = `SELECT ${selectColumns} FROM "Cinema" AS cinema INNER JOIN "Address" AS address ON cinema.id_address = address.id_address`;
  const queryParams = [];
  let queryConditions = "";

  if (name) {
    queryParams.push(name);
    queryConditions += ` cinema.name = $${queryParams.length}`;
  }

  if (street) {
    queryParams.push(street);
    queryConditions +=
      (queryConditions ? " AND" : "") +
      ` address.street = $${queryParams.length}`;
  }

  if (city) {
    queryParams.push(city);
    queryConditions +=
      (queryConditions ? " AND" : "") +
      ` address.city = $${queryParams.length}`;
  }

  if (queryConditions) {
    query += " WHERE" + queryConditions;
  }

  try {
    const { rows } = await client.query(query, queryParams);

    if (rows.length === 0) {
      res.status(404).json({ message: "Cinema not found" });
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

const getCinemasListByName = async (req, res) => {
  const name = req.params.name;
  const client = await poolDB.connect();

  try {
    const { rows } = await client.query(
      'SELECT cinema.id_cinema, cinema.name, address.id_address, address.street, address.building_number, address.apartment_number, address.postal_code, address.city, address.country, cinema.phone FROM "Cinema" AS cinema INNER JOIN "Address" AS address ON cinema.id_address = address.id_address WHERE cinema.name = $1',
      [name]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Cinema not found" });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

module.exports = {

  getCinemasList,
  getCinemasListByName,
};
