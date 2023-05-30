require("dotenv").config();
const poolDB = require('../db/db.js');

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

module.exports = {
  getSeats,
  getSeatById,
};
