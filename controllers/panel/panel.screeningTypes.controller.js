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
const addScreeningType = async (req, res) => {
  const client = await poolDB.connect();
  const { language, subtitle } = req.body;

  try {
    await client.query("BEGIN");

    const { rows: existingScreeningTypeRows } = await client.query(
      `SELECT * FROM "Screening_Type" WHERE language = $1 AND subtitle = $2`,
      [language, subtitle]
    );

    if (existingScreeningTypeRows.length > 0) {
      res
        .status(409)
        .send({
          message:
            "Screening type with the same language and subtitle already exists",
        });
      await client.query("ROLLBACK");
    } else {
      await client.query(
        `INSERT INTO "Screening_Type" (language, subtitle) VALUES ($1, $2)`,
        [language, subtitle]
      );

      await client.query("COMMIT");
      res.status(201).json({ message: "Screening type added successfully." });
    }
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ error: "Failed to add screening type" });
  } finally {
    client.release();
  }
};

const updateScreeningType = async (req, res) => {
  const client = await poolDB.connect();
  const { language, subtitle } = req.body;
  const id = parseInt(req.params.id);

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      'SELECT * FROM "Screening_Type" WHERE id_screening_type = $1',
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Screening type not found" });
      await client.query("ROLLBACK");
      return;
    }

    const screeningType = rows[0];
    const updatedScreeningTypeData = {
      language: language || screeningType.language,
      subtitle: subtitle || screeningType.subtitle,
    };

    await client.query(
      'UPDATE "Screening_Type" SET language = $1, subtitle = $2 WHERE id_screening_type = $3',
      [updatedScreeningTypeData.language, updatedScreeningTypeData.subtitle, id]
    );

    await client.query("COMMIT");
    res.status(200).json({ message: "Screening type updated successfully." });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ error: "Failed to update screening type" });
  } finally {
    client.release();
  }
};

const deleteScreeningType = async (req, res) => {
  const client = await poolDB.connect();
  const id = parseInt(req.params.id);

  try {
    await client.query("BEGIN");

    const { rowCount } = await client.query(
      'DELETE FROM "Screening_Type" WHERE id_screening_type = $1',
      [id]
    );

    if (rowCount === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({ message: "Screening type not found" });
    } else {
      await client.query("COMMIT");
      res.status(200).json({ message: "Screening type deleted successfully." });
    }
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ error: "Failed to delete screening type" });
  } finally {
    client.release();
  }
};

module.exports = {
  addScreeningType,
  updateScreeningType,
  deleteScreeningType,
};
