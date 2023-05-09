const { oleCheckJWT } = require("../../middleware");
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
    "/api/panel/hall/:hallId/seats",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    seat.addSeat
  );
  app.put(
    "/api/panel/hall/:hallId/seats/:seatId",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    seat.updateSeatData
  );
  app.delete(
    "/api/panel/hall/:hallId/seats/:seatId",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    seat.deleteSeat
  );

}
