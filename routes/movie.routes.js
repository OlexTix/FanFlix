const { oleCheckJWT } = require("../middleware");
const movie = require("../controllers/movie.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(cors({
    origin: "*",
    allowedHeaders: "x-access-token, Origin, Content-Type, Accept"
  }));

  app.post('/api/movies/add', oleCheckJWT.verifyToken, movie.addMovie)
  app.get('/api/movies', oleCheckJWT.verifyToken, movie.getMovies)
  app.get('/api/movies/:id', oleCheckJWT.verifyToken, movie.getMovieById)
  app.put('/api/movies/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, movie.updateMoviesData)
  app.delete('/api/movies/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, movie.deleteMovie)

};