require("dotenv").config();
var bcrypt = require("bcryptjs");

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

const getUsers = async (req, res) => {
  const client = await poolDB.connect();

  try {
    let queryParams = [];
    let query = 'SELECT id_user, first_name, last_name, email, phone, birth_date, role, registration_date, is_active FROM "User"';

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

    const { rows } = await client.query(query, queryParams);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

const resetPassword = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  const validUpdates = ["oldPassword", "newPassword", "email"];
  const isValidUpdate = Object.keys(updates).every((update) => validUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid update body!' });
  }

  const { oldPassword, newPassword, email } = updates;

  // Check if the user is either the user whose password is being reset or an admin
  if (Number(req.params.id) !== req.userId && req.role !== 'admin') {
    return res.status(403).send({ message: "Unauthorized: You can't reset someone else's password" });
  }

  const client = await poolDB.connect();

  try {
    const { rows } = await client.query(
      'SELECT password_hash, email FROM "User" WHERE id_user = $1',
      [userId]
    );

    if (rows.length === 0) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    const user = rows[0];

    // Check if the email in the request matches the email in the database
    if (email !== user.email) {
      return res.status(403).send({ message: "Unauthorized: Email does not match the account" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid old password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 8);

    await client.query(
      'UPDATE "User" SET password_hash = $1 WHERE id_user = $2',
      [hashedNewPassword, userId]
    );

    res.status(200).send({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to update password" });
  } finally {
    client.release();
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  const validUpdates = ["first_name", "last_name", "email", "phone", "birth_date", "role", "is_active"];
  const isValidUpdate = Object.keys(updates).every((update) => validUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid update body!' });
  }

  const client = await poolDB.connect();

  try {
    const { rows } = await client.query(
      'SELECT * FROM "User" WHERE id_user = $1',
      [userId]
    );

    if (rows.length === 0) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    const user = rows[0];

    const updatedUserData = {
      first_name: updates.first_name || user.first_name,
      last_name: updates.last_name || user.last_name,
      email: updates.email || user.email,
      phone: updates.phone || user.phone,
      birth_date: updates.birth_date || user.birth_date,
      role: updates.role || user.role,
      is_active: updates.is_active || user.is_active,
    };

    await client.query(
      'UPDATE "User" SET first_name=$1, last_name=$2, email=$3, phone=$4, birth_date=$5, role=$6, is_active=$7 WHERE id_user=$8',
      [
        updatedUserData.first_name,
        updatedUserData.last_name,
        updatedUserData.email,
        updatedUserData.phone,
        updatedUserData.birth_date,
        updatedUserData.role,
        updatedUserData.is_active,
        userId,
      ]
    );

    res.status(200).send({ message: "User data updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to update user data" });
  } finally {
    client.release();
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const currentUserId = req.userId; 

  if (userId == currentUserId) {
    res.status(403).send({ message: "You can't delete yourself" });
    return;
  }

  const client = await poolDB.connect();

  try {
    // Check if user exists
    const { rowCount } = await client.query(
      'SELECT * FROM "User" WHERE id_user = $1',
      [userId]
    );

    if (rowCount === 0) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    // Delete user
    await client.query('DELETE FROM "User" WHERE id_user = $1', [userId]);

    res.send({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to delete user" });
  } finally {
    client.release();
  }
};

module.exports = {
  getUsers,
  resetPassword,
  updateUser,
  deleteUser,
};
