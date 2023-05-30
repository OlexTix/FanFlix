require("dotenv").config();
const poolDB = require('../db/db.js');

const getGenres = async (req, res) => {
  try {
    const { rows } = await poolDB.query(`SELECT id_genre AS id, name FROM "Genre"`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getGenres
};