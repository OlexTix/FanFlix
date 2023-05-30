require("dotenv").config();
const poolDB = require('../db/db.js');

const getScreeningTypes = async (req, res) => {
  try {
    const { rows } = await poolDB.query(`SELECT id_screening_type AS id, language FROM "Screening_Type"`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getScreeningTypes
};