const { oleCheckJWT } = require("../../middleware");
const panel = require("../../controllers/panel/panel.cinema.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.get(
    "/api/panel/cinemas", 
    oleCheckJWT.verifyToken, 
    panel.getCinemas
  );

  app.post(
    "/api/panel/cinemas", 
    oleCheckJWT.verifyToken, 
    panel.addCinema);

  app.put(
    "/api/panel/cinemas/:id",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    panel.updateCinemasData
  );
  app.delete(
    "/api/panel/cinemas/:id",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    panel.deleteCinema
  );
};
