require("dotenv").config();
const poolDB = require('../db/db.js');


const getScreenings = async (req, res) => {
  const {
    id,
    id_movie,
    id_cinema_hall,
    hall_number,
    id_screening_type,
    language,
    subtitle,
    cinema_name,
    cinema_city,
    date,
    time
  } = req.query;
  const client = await poolDB.connect();

  const queryParams = [];
  let queryConditions = "";
  const conditionsMapping = {
    id: { value: id, column: "s.id_screening" },
    id_movie: { value: id_movie, column: "s.id_movie" },
    id_cinema_hall: { value: id_cinema_hall, column: "ch.id_cinema_hall" },
    hall_number: { value: hall_number, column: "ch.hall_number" },
    id_screening_type: { value: id_screening_type, column: "st.id_screening_type" },
    language: { value: language, column: "st.language" },
    subtitle: { value: subtitle, column: "st.subtitle" },
    cinema_name: { value: cinema_name, column: "c.name" },
    cinema_city: { value: cinema_city, column: "a.city" },
    date: { value: date, column: "s.date" },
    time: { value: time, column: "s.time" }
  };

  Object.keys(conditionsMapping).forEach((key, index) => {
    const condition = conditionsMapping[key];
    if (condition.value) {
      queryParams.push(condition.value);
      queryConditions += ` AND ${condition.column} = $${queryParams.length}`;
    }
  });

  let query = `
    SELECT 
      s.id_screening, 
      s.id_movie, 
      ch.id_cinema_hall, 
      ch.hall_number, 
      st.id_screening_type, 
      st.language, 
      st.subtitle,
      c.name,
      a.city,
      TO_CHAR(s.date, 'YYYY-MM-DD') as date,
      TO_CHAR(s.time, 'HH24:MI') as time
    FROM "Screening" AS s
    INNER JOIN "Cinema_Hall" AS ch ON s.id_cinema_hall = ch.id_cinema_hall
    INNER JOIN "Screening_Type" AS st ON s.id_screening_type = st.id_screening_type
    INNER JOIN "Cinema" AS c ON ch.id_cinema = c.id_cinema
    INNER JOIN "Address" AS a ON c.id_address = a.id_address
  `;

  if (queryConditions) {
    query += ` WHERE ${queryConditions.slice(5)} AND s.archived = false`;
  } else {
    query += ` WHERE s.archived = false`;
  }

  query += ` GROUP BY s.id_screening, s.id_movie, ch.id_cinema_hall, ch.hall_number, st.id_screening_type, st.language, st.subtitle, s.date, s.time, c.name, a.city`;

  try {
    const { rows: movieRows } = await client.query(query, queryParams);

    if (movieRows.length === 0) {
      res.status(404).send({ message: "Screenings not found" });
    } else {
      res.status(200).json(movieRows);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to get screenings list" });
  } finally {
    client.release();
  }
};


module.exports = {
  getScreenings,
};
