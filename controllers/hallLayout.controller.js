require("dotenv").config();
const poolDB = require('../db/db.js');

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
  