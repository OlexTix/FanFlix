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
  const client = await poolDB.connect();

  try {
    let queryParams = [];
    let query = `SELECT "Cinema_Hall".id_cinema_hall, "Cinema_Hall".hall_number, "Cinema_Hall".number_of_seats, "Cinema".id_cinema, "Cinema".name FROM "Cinema_Hall" JOIN "Cinema" ON "Cinema_Hall".id_cinema = "Cinema".id_cinema`;

    const conditions = [];
    for (const key in req.query) {
      if (
        req.query.hasOwnProperty(key) &&
        key !== "sortBy" &&
        key !== "order" &&
        key !== "limit" &&
        key !== "offset"
      ) {
        if (typeof req.query[key] !== "string" || req.query[key].length > 255) {
          return res.status(400).send({ message: "Invalid query parameters" });
        }
        conditions.push(`"${key}" = $${queryParams.length + 1}`);
        queryParams.push(req.query[key].replace(/[^a-zA-Z0-9_ -]/g, ""));
      }
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    if (req.query.sortBy && req.query.order) {
      if (["asc", "desc"].includes(req.query.order.toLowerCase())) {
        query += ` ORDER BY "${req.query.sortBy}" ${req.query.order}`;
      } else {
        return res.status(400).send({ message: "Invalid sort order" });
      }
    }

    if (req.query.limit) {
      if (!Number.isInteger(parseInt(req.query.limit))) {
        return res.status(400).send({ message: "Limit must be an integer" });
      }
      query += ` LIMIT $${queryParams.length + 1}`;
      queryParams.push(parseInt(req.query.limit));
    }

    if (req.query.offset) {
      if (!Number.isInteger(parseInt(req.query.offset))) {
        return res.status(400).send({ message: "Offset must be an integer" });
      }
      query += ` OFFSET $${queryParams.length + 1}`;
      queryParams.push(parseInt(req.query.offset));
    }

    const { rows } = await client.query(query, queryParams);

    if (rows.length === 0) {
      res.status(404).send({ message: "Halls not found" });
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to get halls" });
  } finally {
    client.release();
  }
};

const addHall = async (req, res) => {
  const { cinema_name, hall_number, number_of_seats } = req.body;
  const client = await poolDB.connect();

  try {
    const { rows: cinemaRows } = await client.query(
      'SELECT * FROM "Cinema" WHERE name = $1',
      [cinema_name]
    );

    if (cinemaRows.length === 0) {
      res.status(404).send({ message: "Cinema not found" });
      return;
    }

    const cinemaId = cinemaRows[0].id_cinema;

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

const updateHallsData = async (req, res) => {
  const hallId = parseInt(req.params.hallId);
  const { hall_number, number_of_seats } = req.body;
  const client = await poolDB.connect();

  try {
    // Check if hall exists and retrieve current data
    const { rows: hallRows } = await client.query(
      'SELECT * FROM "Cinema_Hall" WHERE id_cinema_hall = $1',
      [hallId]
    );

    if (hallRows.length === 0) {
      res.status(404).send({ message: "Hall not found" });
      return;
    }

    const currentHallData = hallRows[0];
    const cinemaId = currentHallData.id_cinema;

    const { rows: cinemaRows } = await client.query(
      'SELECT * FROM "Cinema" WHERE id_cinema = $1',
      [cinemaId]
    );

    if (cinemaRows.length === 0) {
      res.status(404).send({ message: "Cinema not found" });
      return;
    }

    const newHallData = {
      hall_number: hall_number || currentHallData.hall_number,
      number_of_seats: number_of_seats || currentHallData.number_of_seats,
    };

    const { rowCount } = await client.query(
      'UPDATE "Cinema_Hall" SET hall_number = $1, number_of_seats = $2 WHERE id_cinema_hall = $3',
      [newHallData.hall_number, newHallData.number_of_seats, hallId]
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
  const hallId = parseInt(req.params.hallId);
  const client = await poolDB.connect();

  try {
    const { rows: hallRows } = await client.query(
      'SELECT * FROM "Cinema_Hall" WHERE id_cinema_hall = $1',
      [hallId]
    );

    if (hallRows.length === 0) {
      res.status(404).send({ message: "Hall not found" });
      return;
    }

    const cinemaId = hallRows[0].id_cinema;

    const { rows: cinemaRows } = await client.query(
      'SELECT * FROM "Cinema" WHERE id_cinema = $1',
      [cinemaId]
    );

    if (cinemaRows.length === 0) {
      res.status(404).send({ message: "Cinema not found" });
      return;
    }

    await client.query("BEGIN");

    // archive all screenings associated
    await client.query(
      'UPDATE "Screening" SET archived = TRUE WHERE id_cinema_hall = $1',
      [hallId]
    );

    await client.query(
      'UPDATE "Screening" SET id_cinema_hall = null WHERE id_cinema_hall = $1',
      [hallId]
    );

    await client.query('DELETE FROM "Seat" WHERE id_cinema_hall = $1', [
      hallId,
    ]);

    const { rowCount } = await client.query(
      'DELETE FROM "Cinema_Hall" WHERE id_cinema_hall = $1',
      [hallId]
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
  getHalls,
  addHall,
  updateHallsData,
  deleteHall,
};
