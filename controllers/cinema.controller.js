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

const getCinemas = async (req, res) => {
  const client = await poolDB.connect();
  try {
    const { rows } = await client.query(
      'SELECT cinema.id_cinema, cinema.name, address.id_address, address.street, address.building_number, address.apartment_number, address.postal_code, address.city, address.country, cinema.phone FROM "Cinema" AS cinema INNER JOIN "Address" AS address ON cinema.id_address = address.id_address'
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

const getCinemaById = async (req, res) => {
  const id = parseInt(req.params.id);
  const client = await poolDB.connect();

  try {
    const { rows } = await client.query(
      'SELECT cinema.id_cinema, cinema.name, address.id_address, address.street, address.building_number, address.apartment_number, address.postal_code, address.city, address.country, cinema.phone FROM "Cinema" AS cinema INNER JOIN "Address" AS address ON cinema.id_address = address.id_address WHERE cinema.id_cinema = $1',
      [id]
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
  getCinemasList,
  getCinemasListByName,
  getCinemaById,
  updateCinemasData,
  deleteCinema,
};
