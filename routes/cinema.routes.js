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
  
  app.get("/api/cinemas", cinema.getCinemasList);
  app.get("/api/cinemas/:name", cinema.getCinemasListByName);
  
};
