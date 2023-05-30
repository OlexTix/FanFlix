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

  app.get("/api/cinemas/:name/halls", hall.getHalls);
  app.get("/api/cinemas/:name/halls/:hallNumber", hall.getHallByHallNumber);
  app.get("/api/hallNumbers", hall.getHallNumbers);

};
