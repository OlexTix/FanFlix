const { oleCheckJWT } = require("../middleware");
const cinema = require("../controllers/cinema.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.post("/api/cinemas", oleCheckJWT.verifyToken, cinema.addCinema);
  app.get("/api/cinemas/all", oleCheckJWT.verifyToken, cinema.getCinemas);
  app.get("/api/cinemas", cinema.getCinemasList);
  app.get("/api/cinemas/:name", cinema.getCinemasListByName);
  app.get(
    "/api/cinemas/all/:id",
    oleCheckJWT.verifyToken,
    cinema.getCinemaById
  );
  app.put(
    "/api/cinemas/:id",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    cinema.updateCinemasData
  );
  app.delete(
    "/api/cinemas/:id",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    cinema.deleteCinema
  );
};
