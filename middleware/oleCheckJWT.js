require('dotenv').config();
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

const Pool = require('pg').Pool
const poolDB = new Pool({
  user: process.env.DATABASE_USER_NAME,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
})

const verifyToken = async (req, res, next) => {
    let token = req.headers["x-access-token"];
    

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const client = await poolDB.connect();

        // Find user with decoded ID
        const {
            rows: [user],
        } = await client.query("SELECT * FROM users WHERE id=$1", [decoded.id]);

        if (!user) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        //store decoded JWT payload to be accessible to other middleware
        req.userId = decoded.id;
        req.roleId = decoded.roleId;
        next();

        client.release();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).send({ message: "Unauthorized! Access token was expired!" + err.message });
        }
        console.error(err.message);

        res.status(401).send({ message: "Unauthorized" });
    }
};

const isAdmin = async (req, res, next) => {
  const userId = req.userId;
  const client = await poolDB.connect();

  try {
    const {
      rows: [userRole],
    } = await client.query(
      "SELECT role_name FROM user_roles WHERE role_id = (SELECT role_id FROM users WHERE id = $1)",
      [userId]
    );

    if (userRole.role_name !== "admin") {
      throw new Error("User isn't admin");
    }
    // user is admin
    next();
  } catch (err) {
    res.status(401).send({ message: "Unauthorized" });
  } finally {
    client.release();
  }
};



const oleCheckJWT = {
    verifyToken,
    isAdmin,
};
module.exports = oleCheckJWT;