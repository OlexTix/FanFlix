require("dotenv").config();
const poolDB = require('../../db/db.js');

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