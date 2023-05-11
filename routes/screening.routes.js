const { oleCheckJWT } = require("../middleware");
const screening = require("../controllers/screening.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.get("/api/cinemas/:name/screenings", screening.getScreenings);
  app.get(
    "/api/cinemas/:name/screenings/:screeningName",
    screening.getScreeningByName
  );
};
