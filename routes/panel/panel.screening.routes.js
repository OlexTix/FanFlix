const { oleCheckJWT } = require("../../middleware");
const screening = require("../../controllers/panel/panel.screening.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );
  app.get(
    "/api/panel/screenings",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    screening.getScreenings
  );

  app.post(
    "/api/panel/screenings",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    screening.addScreening
  );

  app.put(
    "/api/panel/screenings/:screeningId",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    screening.updateScreeningsData
  );
  app.delete(
    "/api/panel/screenings/:screeningId",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    screening.deleteScreening
  );

  }