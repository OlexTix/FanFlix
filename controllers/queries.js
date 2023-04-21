require('dotenv').config();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
const { oleCheckJWT } = require("../middleware");

const Pool = require('pg').Pool

const connectionString = process.env.DATABASE_LINK;

const poolDB = new Pool({
  connectionString,
});

const getUsers = async (req, res) => {
  const client = await poolDB.connect();

  try {
    const { rows } = await client.query('SELECT id_user, first_name, last_name, email, phone, birth_date, role, registration_date, is_active FROM "User" ORDER BY "id_user" ASC');
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
    } = await client.query('SELECT id_user, first_name, last_name, email, phone, birth_date, role, registration_date, is_active FROM "User" WHERE "id_user" = $1', [id]);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
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

const registerUser = async (req, res) => {
  const { first_name, last_name, email, password, phone, birth_date, role } = req.body;

  // Default to "client" role if none provided or an invalid role was given
  const validRoles = ['client', 'employee', 'admin'];
  const userRole = validRoles.includes(role) ? role : 'client';

  try {
    const client = await poolDB.connect();

    // Check if user with same email already exists
    const {
      rows: existingUsers,
    } = await client.query(
      'SELECT * FROM "User" WHERE email=$1',
      [email]
    );
    if (existingUsers.length > 0) {
      res.status(400).send({ message: "Email is already taken" });
      return;
    }

    // Insert new user with hashed password and default role
    const {
      rows: insertedUser,
    } = await client.query(
      'INSERT INTO "User" (first_name, last_name, email, password_hash, phone, birth_date, role, registration_date, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), true) RETURNING id_user',
      [first_name, last_name, email, bcrypt.hashSync(password, 8), phone, birth_date, userRole]
    );

    if (insertedUser) {
      res.send({ message: "User was registered successfully!" });
    } else {
      res.status(500).send({ message: "Failed to register user" });
    }

    client.release();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await poolDB.connect();

    // Find user with provided email
    const {
      rows: [User],
    } = await client.query('SELECT * FROM "User" WHERE email=$1', [email]);

    if (!User) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    // Create a hash from provided password and check if passwords match
    const passwordIsValid = bcrypt.compareSync(password, User.password_hash);
    if (!passwordIsValid) {
      res.status(401).send({ message: "Invalid password" });
      return;
    }

    const role = User.role;

    // Create JWT token with User ID and role in JWT's payload
    const token = jwt.sign({ id: User.id_user, role: role }, config.secret, {
      expiresIn: config.tokenExpiration, // 24 hours
    });

    // Insert current timestamp to last_login in User table
    await client.query('UPDATE "User" SET last_login = NOW() WHERE id_user = $1', [User.id]);

    res.send({
      first_name: User.first_name,
      last_name: User.last_name,
      email: User.email,
      role: role,
      accessToken: token,
    });

    client.release();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};


const updateUserPass = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.userId;

  // Verify that the old password is correct
  try {
    const client = await poolDB.connect();
    const { rows } = await client.query('SELECT password_hash, role FROM "User" WHERE id_user=$1', [userId]);
    const User = rows[0];

    if (!User) {
        return res.status(401).send({ message: "Unauthorized: Wrong old password" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, User.password_hash);
    if (!isPasswordValid) {
        return res.status(401).send({ message: "Invalid old password" });
    }

    // Update the User's password
    const hashedNewPassword = await bcrypt.hash(newPassword, 8);
    await client.query('UPDATE "User" SET password_hash=$1 WHERE id_user=$2', [hashedNewPassword, userId]);

    res.status(200).send({ message: "Password updated successfully"});

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
    const { rowCount } = await client.query('SELECT * FROM "User" WHERE id_user = $1', [userId]);

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
  registerUser,
  loginUser,
  updateUserPass,
  deleteUser,
}