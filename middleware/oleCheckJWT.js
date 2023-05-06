require("dotenv").config();
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

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
  schema: "public",
});

const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, config.secret, {
      expiresIn: config.tokenExpiration,
    });
    const client = await poolDB.connect();
    // Find user with decoded ID
    const {
      rows: [user],
    } = await client.query('SELECT * FROM "User" WHERE id_user=$1', [
      decoded.id,
    ]);

    if (!user) {
      return res.status(401).send({ message: "Unauthorized: no such user" });
    }

    // Store decoded JWT payload to be accessible to other middleware
    req.userId = decoded.id;
    req.role = decoded.role;

    if (req.path === "/api/auth/expiration") {
      client.release();
      return res.status(200).send({ message: "Authorized" });
    }
    next();

    client.release();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .send({
          message: "Unauthorized! Access token was expired!" + err.message,
        });
    }
    console.error(err.message);

    res.status(401).send({ message: "Unauthorized: error" });
  }
};

const isAdmin = async (req, res, next) => {
  const userId = req.userId;
  const client = await poolDB.connect();

  try {
    const { rows } = await client.query(
      'SELECT role FROM "User" WHERE id_user = $1',
      [userId]
    );
    const userRole = rows[0].role;
    if (userRole !== "admin") {
      throw new Error("User is not an admin");
    }
    // user is admin
    next();
  } catch (err) {
    res.status(401).send({ message: "Unauthorized: Not an admin" });
  } finally {
    client.release();
  }
};

const oleCheckJWT = {
  verifyToken,
  isAdmin,
};
module.exports = oleCheckJWT;
