const { oleCheckJWT } = require("../../middleware");
const hall = require("../../controllers/panel/panel.halls.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.get(
    "/api/panel/halls",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    hall.getHalls
  );
  app.post(
    "/api/panel/halls",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    hall.addHall
  );
  app.put(
    "/api/panel/halls/:hallId",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    hall.updateHallsData
  );
  app.delete(
    "/api/panel/halls/:hallId",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    hall.deleteHall
  );
};
