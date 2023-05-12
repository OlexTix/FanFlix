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

const getDirectors = async (req, res) => {
    const client = await poolDB.connect();
  
    let query = `
      SELECT 
        d.id_director, 
        d.first_name, 
        d.last_name, 
        d.nationality
      FROM "Director" AS d
    `;
  
    const queryParams = [];
    const conditions = [];
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key) && key !== "sortBy" && key !== "order" && key !== "limit" && key !== "offset") {
        if (typeof req.query[key] !== 'string' || req.query[key].length > 255) {
          return res.status(400).send({ message: "Invalid query parameters" });
        }
        conditions.push(`"${key}" = $${queryParams.length + 1}`);
        queryParams.push(req.query[key].replace(/[^a-zA-Z0-9_ -]/g, ''));
      }
    }
  
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
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
  
    try {
      const { rows: directorRows } = await client.query(query, queryParams);
  
      if (directorRows.length === 0) {
        res.status(404).send({ message: "Directors not found" });
      } else {
        res.status(200).json(directorRows);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: "Failed to get directors list" });
    } finally {
      client.release();
    }
  };
  
  module.exports = {
    getDirectors,
  };