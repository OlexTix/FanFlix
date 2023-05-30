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

const addGenre = async (req, res) => {
    try {
      const { name } = req.body;
      await poolDB.query('INSERT INTO "Genre" (name) VALUES ($1)', [name]);
      res.status(201).json({ message: 'Genre added successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  const updateGenre = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await poolDB.query('UPDATE "Genre" SET name = $1 WHERE id_genre = $2', [name, id]);
      res.status(200).json({ message: 'Genre updated successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  const deleteGenre = async (req, res) => {
    try {
      const { id } = req.params;
      await poolDB.query('DELETE FROM "Genre" WHERE id_genre = $1', [id]);
      res.status(200).json({ message: 'Genre deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = {
    addGenre,
    updateGenre,
    deleteGenre
  };