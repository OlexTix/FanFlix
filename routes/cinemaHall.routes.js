const { oleCheckJWT } = require("../middleware");
const hall = require("../controllers/cinemaHall.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post('/cinemas/:id/halls', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, hall.addHall)
  app.get('/cinemas/:id/halls', oleCheckJWT.verifyToken, hall.getHalls)
  app.get('/cinemas/:id/halls/:hallId', oleCheckJWT.verifyToken, hall.getHallById)
  app.put('/cinemas/:id/halls/:hallId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, hall.updateHallsData)
  app.delete('/cinemas/:id/halls/:hallId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, hall.deleteHall)

};