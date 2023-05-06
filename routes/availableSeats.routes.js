const { oleCheckJWT } = require("../middleware");
const availableSeatsController = require("../controllers/availableSeats.controller");
const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.get(
    "/api/cinemas/:name/screenings/:screeningName/availableSeats",
    oleCheckJWT.verifyToken,
    availableSeatsController.getAvailableSeats
  );

  app.post(
    "/api/cinemas/:name/screenings/:screeningName/saveSelectedSeats",
    oleCheckJWT.verifyToken,
    availableSeatsController.saveSelectedSeats
  );
};