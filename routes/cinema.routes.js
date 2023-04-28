const { oleCheckJWT } = require("../middleware");
const cinema = require("../controllers/cinema.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post('/api/cinemas', oleCheckJWT.verifyToken, cinema.addCinema)
  app.get('/api/cinemas/all', oleCheckJWT.verifyToken, cinema.getCinemas)
  app.get('/api/cinemas', cinema.getCinemasList)
  app.get('/api/cinemas/:name', cinema.getCinemasListByName)
  app.get('/api/cinemas/all/:id', oleCheckJWT.verifyToken, cinema.getCinemaById)
  app.put('/api/cinemas/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, cinema.updateCinemasData)
  app.delete('/api/cinemas/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, cinema.deleteCinema)

};