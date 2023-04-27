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

  app.post('/cinema', oleCheckJWT.verifyToken, cinema.addCinema)
  app.get('/cinema', oleCheckJWT.verifyToken, cinema.getCinemas)
  app.get('/all/cinema', cinema.getCinemasList)
  app.get('/all/cinema/:id', cinema.getCinemasListById)
  app.get('/cinema/:id', oleCheckJWT.verifyToken, cinema.getCinemaById)
  app.put('/cinema/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, cinema.updateCinemasData)
  app.delete('/cinema/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, cinema.deleteCinema)

};