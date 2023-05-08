const { oleCheckJWT } = require("../middleware");
const hall = require("../controllers/cinemaHall.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.post(
    "/api/cinemas/:id/halls",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    hall.addHall
  );
  app.put(
    "/api/cinemas/:id/halls/:hallId",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    hall.updateHallsData
  );
  app.delete(
    "/api/cinemas/:id/halls/:hallId",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    hall.deleteHall
  );
};