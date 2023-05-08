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

const rowLetterToIndex = (letter) => {
    return letter.charCodeAt(0) - "A".charCodeAt(0);
  };
  
  const getHallLayout = async (req, res) => {
    const id_cinema_hall = req.query.id_cinema_hall;
  
    if (!id_cinema_hall) {
      res.status(400).json({ message: "Missing id_cinema_hall parameter" });
      return;
    }
  
    const client = await poolDB.connect();
  
    try {
      const { rows } = await client.query(
        'SELECT seat.row, seat.seat_number, seat.status FROM "Seat" AS seat WHERE seat.id_cinema_hall = $1 ORDER BY seat.row, seat.seat_number',
        [id_cinema_hall]
      );
  
      if (rows.length === 0) {
        res.status(404).json({ message: "Cinema hall not found" });
      } else {
        const hallLayout = rows.reduce((acc, seat) => {
          const rowIndex = rowLetterToIndex(seat.row);
          if (!acc[rowIndex]) {
            acc[rowIndex] = [];
          }
          acc[rowIndex].push(seat.status);
          return acc;
        }, []);
  
        const horizontalLayout = hallLayout.map(row => {
          return row.reduce((acc, status, index) => {
            acc.push(status);
            return acc;
          }, []);
        });
  
        res.status(200).json({ cinemaHall: horizontalLayout });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    } finally {
      client.release();
    }
  };

module.exports = {

    getHallLayout,
  };
  