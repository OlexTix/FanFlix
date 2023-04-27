const { oleCheckJWT } = require("../middleware");
const cinema = require("../controllers/cinema.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post('/cinemas', oleCheckJWT.verifyToken, cinema.addCinema)
  app.get('/cinemas/all', oleCheckJWT.verifyToken, cinema.getCinemas)
  app.get('/cinemas', cinema.getCinemasList)
  app.get('/cinemas/:id', cinema.getCinemasListById)
  app.get('/cinemas/all/:id', oleCheckJWT.verifyToken, cinema.getCinemaById)
  app.put('/cinemas/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, cinema.updateCinemasData)
  app.delete('/cinemas/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, cinema.deleteCinema)

};