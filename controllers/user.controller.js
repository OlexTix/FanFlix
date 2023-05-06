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
    const { rows } = await client.query(
      'SELECT id_user, first_name, last_name, email, phone, birth_date, role, registration_date, is_active FROM "User" ORDER BY "id_user" ASC'
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  const client = await poolDB.connect();

  try {
    const {
      rows: [user],
    } = await client.query(
      'SELECT id_user, first_name, last_name, email, phone, birth_date, role, registration_date, is_active FROM "User" WHERE "id_user" = $1',
      [id]
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

const updateUserPass = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.userId;

  // Verify that the old password is correct
  try {
    const client = await poolDB.connect();
    const { rows } = await client.query(
      'SELECT password_hash, role FROM "User" WHERE id_user=$1',
      [userId]
    );
    const User = rows[0];

    if (!User) {
      return res
        .status(401)
        .send({ message: "Unauthorized: Wrong old password" });
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      User.password_hash
    );
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid old password" });
    }

    // Update the User's password
    const hashedNewPassword = await bcrypt.hash(newPassword, 8);
    await client.query('UPDATE "User" SET password_hash=$1 WHERE id_user=$2', [
      hashedNewPassword,
      userId,
    ]);

    res.status(200).send({ message: "Password updated successfully" });

    client.release();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
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
  getUserById,
  updateUserPass,
  deleteUser,
};
