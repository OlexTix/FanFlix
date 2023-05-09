const { oleCheckJWT } = require("../middleware");
const seat = require("../controllers/seat.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );


  app.get("/api/cinemas/:name/halls/:hallNumber/seats/", seat.getSeats);
  app.get(
    "/api/cinemas/:name/halls/:hallNumber/seats/:seatNumber",
    seat.getSeatById
  );

};
