const { oleCheckJWT } = require("../middleware");
const movie = require("../controllers/genre.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.get("/api/genres", movie.getGenres);
};
