const { oleCheckJWT } = require("../middleware");
const screenings = require("../controllers/screenings.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.get("/api/screenings", screenings.getScreenings);

};