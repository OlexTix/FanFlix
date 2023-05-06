const { oleCheckJWT } = require("../middleware");
const auth = require("../controllers/auth.controller");
const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.get(
    "/api/auth/expiration",
    oleCheckJWT.verifyToken,
    auth.checkExpiration
  );
  app.post("/api/auth/register", auth.registerUser);
  app.post("/api/auth/login", auth.loginUser);
};
