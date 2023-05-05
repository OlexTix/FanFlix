const { oleCheckJWT } = require("../middleware");
const movie = require("../controllers/movie.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(cors({
    origin: "*",
    allowedHeaders: "x-access-token, Origin, Content-Type, Accept"
  }));

  app.post('/api/movies/add', oleCheckJWT.verifyToken, movie.addMovie)
  app.get('/api/movies', movie.getMovies)
  app.get('/api/movies/:movieName', movie.getMovieByName)
  app.put('/api/movies/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, movie.updateMoviesData)
  app.delete('/api/movies/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, movie.deleteMovie)

};