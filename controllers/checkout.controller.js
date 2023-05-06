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
const processCheckout = async (req, res) => {
  const { name, screeningName } = req.params;
  const { payment_details } = req.body;
  const { userId } = req;
  const selected_seats = req.session.selected_seats;

  if (!name || !screeningName || !userId || !selected_seats || !payment_details) {
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

    await pool.query("BEGIN");

    // Insert payment details
    const paymentResult = await poolDB.query(
      `INSERT INTO "User_Payment" (id_user, payment_details) VALUES ($1, $2) RETURNING id_payment`,
      [user_id, payment_details]
    );

    const payment_id = paymentResult.rows[0].id_payment;

    // Insert tickets
    const ticketInsertPromises = selected_seats.map((seat) =>
      poolDB.query(
        `INSERT INTO "Ticket" (id_user, id_screening, id_seat, id_ticket_type, id_payment) VALUES ($1, $2, $3, $4, $5)`,
        [user_id, screeningResult.rows[0].id_screening, seat.id_seat, seat.ticket_type_id, payment_id]
      )
    );

    await Promise.all(ticketInsertPromises);

    await poolDB.query("COMMIT");

    res.status(201).json({ message: "Tickets successfully purchased" });
  } catch (err) {
    await poolDB.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  processCheckout,
};