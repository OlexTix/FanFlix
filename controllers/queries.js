require('dotenv').config();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
const { oleCheckJWT } = require("../middleware");

const Pool = require('pg').Pool
const poolDB = new Pool({
  user: process.env.DATABASE_USER_NAME,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
})

const getUsers = (req, res) => {
  poolDB.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getUserById = (req, res) => {
  const id = parseInt(req.params.id)

  poolDB.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const registerUser = async (req, res) => {
  const { name, email, password, roles } = req.body;

  // Default to "user" role if none provided
  const userRoles = roles || ["klient"];

  try {
    const client = await poolDB.connect();

    // Check if user with same username or email already exists
    const {
      rows: existingUsers,
    } = await client.query(
      "SELECT * FROM users WHERE name=$1 OR email=$2",
      [name, email]
    );
    if (existingUsers.length > 0) {
      res.status(400).send({ message: "Username or email is already taken" });
      return;
    }

    // Check if provided roles exist in user_roles table
    const {
      rows: foundRoles,
    } = await client.query(
      "SELECT * FROM user_roles WHERE role_name=ANY($1::text[])",
      [userRoles]
    );
    if (foundRoles.length !== userRoles.length) {
      const notFoundRoles = userRoles.filter(
        (role) => !foundRoles.find((r) => r.role_name === role)
      );
      res
        .status(400)
        .send({ message: `Invalid role(s) specified: ${notFoundRoles.join(", ")}` });
      return;
    }

    // Insert new user with hashed password and role_id
    const { rows: insertedUser } = await client.query(
      "INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, email, bcrypt.hashSync(password, 8), foundRoles[0].role_id]
    );
    const userId = insertedUser[0].id;

    res.send({ message: "User was registered successfully!" });

    client.release();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { name, password } = req.body;

  try {
    const client = await poolDB.connect();

    // Find user with provided name
    const {
      rows: [user],
    } = await client.query("SELECT * FROM users WHERE name=$1", [name]);

    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    // Create a hash from provided password and check if passwords match
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      res.status(401).send({ message: "Invalid password" });
      return;
    }

    // Get user role
    const {
      rows: [role],
    } = await client.query("SELECT role_name FROM user_roles WHERE role_id=$1", [user.role_id]);

    // Create JWT token with user ID and role ID in JWT's payload
    const token = jwt.sign({ id: user.id, roleId: user.role_id }, process.env.JWT_SECRET, {
      expiresIn: config.tokenExpiration, // 24 hours
    });

    res.send({
      name: user.name,
      email: user.email,
      role: role.role_name,
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
  const client = await poolDB.connect();
  const { rows } = await client.query("SELECT password FROM users WHERE id=$1", [userId]);
  const user = rows[0];

  if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid old password" });
  }

  // Update the user's password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await client.query("UPDATE users SET password=$1 WHERE id=$2", [hashedNewPassword, userId]);

  res.status(200).send({ message: "Password updated successfully" });

  client.release();
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  const client = await poolDB.connect();

  try {
    // Check if user exists
    const {
      rowCount
    } = await client.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (rowCount === 0) {
      return res.status(404).send({
        message: 'User not found'
      });
    }

    // Delete user
    await client.query('DELETE FROM users WHERE id = $1', [userId]);

    res.status(200).send({
      message: 'User deleted successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      message: 'Internal server error'
    });
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