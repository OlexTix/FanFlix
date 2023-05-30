const { oleCheckJWT } = require("../../middleware");
const movie = require("../../controllers/panel/panel.movies.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );
  app.get("/api/panel/movies", movie.getMovies);
  app.post("/api/panel/movies", oleCheckJWT.verifyToken, movie.addMovie);
  app.put(
    "/api/panel/movies/:id",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    movie.updateMoviesData
  );
  app.delete(
    "/api/panel/movies/:id",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    movie.deleteMovie
  );
};
