const { oleCheckJWT } = require("../middleware");
const movie = require("../controllers/movie.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.get("/api/movies", movie.getMovies);
  app.get("/api/movies/:movieName", movie.getMovieByName);
};
