require("dotenv").config();
const { check, validationResult } = require('express-validator');
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

const getCinemas = async (req, res) => {
  const client = await poolDB.connect();

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let sanitizedQuery = [];
    let query = 'SELECT cinema.id_cinema, cinema.name, address.id_address, address.street, address.building_number, address.apartment_number, address.postal_code, address.city, address.country, cinema.phone FROM "Cinema" AS cinema INNER JOIN "Address" AS address ON cinema.id_address = address.id_address';

    const conditions = [];
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key) && key !== "sortBy" && key !== "order" && key !== "limit" && key !== "offset") {
        conditions.push(`"${key}" = $${sanitizedQuery.length + 1}`);
        sanitizedQuery.push(check(req.query[key]).escape());
      }
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    if (req.query.sortBy && req.query.order) {
      query += ` ORDER BY "${req.query.sortBy}" ${req.query.order}`;
    }

    if (req.query.limit) {
      query += ` LIMIT $${sanitizedQuery.length + 1}`;
      sanitizedQuery.push(parseInt(req.query.limit));
    }

    if (req.query.offset) {
      query += ` OFFSET $${sanitizedQuery.length + 1}`;
      sanitizedQuery.push(parseInt(req.query.offset));
    }

    const { rows } = await client.query(query, sanitizedQuery);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

const addCinema = async (req, res) => {
  const {
    name,
    street,
    building_number,
    apartment_number,
    postal_code,
    city,
    country,
    phone,
  } = req.body;
  const client = await poolDB.connect();

  try {
    await client.query("BEGIN");

    // Insert new address
    const { rows: addressRows } = await client.query(
      'INSERT INTO "Address" (street, building_number, apartment_number, postal_code, city, country) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_address',
      [street, building_number, apartment_number, postal_code, city, country]
    );
    const addressId = addressRows[0].id_address;

    // Insert new cinema associated with the address
    const { rowCount } = await client.query(
      'INSERT INTO "Cinema" (id_address, name, phone) VALUES ($1, $2, $3)',
      [addressId, name, phone]
    );

    await client.query("COMMIT");

    res.status(201).send({ message: "New cinema added successfully" });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error(err.message);
    res.status(500).send({ message: "Failed to add new cinema" });
  } finally {
    client.release();
  }
};

const updateCinemasData = async (req, res) => {
  const id_cinema = req.params.id;
  const {
    name,
    phone,
    street,
    building_number,
    apartment_number,
    postal_code,
    city,
    country,
  } = req.body;

  const client = await poolDB.connect();

  try {
    const { rows } = await client.query(
      'SELECT * FROM "Cinema" WHERE id_cinema = $1',
      [id_cinema]
    );

    if (rows.length === 0) {
      res.status(404).send({ message: "Cinema not found" });
      return;
    }

    const cinema = rows[0];
    const addressId = cinema.id_address;
    const address = await client.query(
      'SELECT * FROM "Address" WHERE id_address = $1',
      [addressId]
    );

    const updatedCinemaData = {
      name: name || cinema.name,
      phone: phone || cinema.phone,
      id_address: addressId,
    };

    const updatedAddressData = {
      street: street || address.rows[0].street,
      building_number: building_number || address.rows[0].building_number,
      apartment_number: apartment_number || address.rows[0].apartment_number,
      postal_code: postal_code || address.rows[0].postal_code,
      city: city || address.rows[0].city,
      country: country || address.rows[0].country,
    };

    await client.query(
      'UPDATE "Cinema" SET name=$1, id_address=$2, phone=$3 WHERE id_cinema=$4',
      [
        updatedCinemaData.name,
        updatedCinemaData.id_address,
        updatedCinemaData.phone,
        id_cinema,
      ]
    );

    await client.query(
      'UPDATE "Address" SET street=$1, building_number=$2, apartment_number=$3, postal_code=$4, city=$5, country=$6 WHERE id_address=$7',
      [
        updatedAddressData.street,
        updatedAddressData.building_number,
        updatedAddressData.apartment_number,
        updatedAddressData.postal_code,
        updatedAddressData.city,
        updatedAddressData.country,
        addressId,
      ]
    );

    res.status(200).send({ message: "Cinema data updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to update cinema data" });
  } finally {
    client.release();
  }
};

const deleteCinema = async (req, res) => {
  const cinemaId = req.params.id;
  const client = await poolDB.connect();

  try {
    // Check if cinema exists
    const { rowCount } = await client.query(
      'SELECT * FROM "Cinema" WHERE id_cinema = $1',
      [cinemaId]
    );

    if (rowCount === 0) {
      res.status(404).send({ message: "Cinema not found" });
      return;
    }

    // Delete cinema and its associated address
    await client.query(
      'DELETE FROM "Address" WHERE id_address = (SELECT id_address FROM "Cinema" WHERE id_cinema = $1)',
      [cinemaId]
    );
    await client.query('DELETE FROM "Cinema" WHERE id_cinema = $1', [cinemaId]);

    res.send({ message: "Cinema deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to delete cinema" });
  } finally {
    client.release();
  }
};

module.exports = {
  addCinema,
  getCinemas,
  updateCinemasData,
  deleteCinema,
};
