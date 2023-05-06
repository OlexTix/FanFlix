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

  app.post(
    "/api/cinemas/:id/halls/:hallId/seats",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    seat.addSeat
  );
  app.get("/api/cinemas/:name/halls/:hallNumber/seats/", seat.getSeats);
  app.get(
    "/api/cinemas/:name/halls/:hallNumber/seats/:seatNumber",
    seat.getSeatById
  );
  app.put(
    "/api/cinemas/:id/halls/:hallId/seats/:seatId",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    seat.updateSeatData
  );
  app.delete(
    "/api/cinemas/:id/halls/:hallId/seats/:seatId",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    seat.deleteSeat
  );
};
