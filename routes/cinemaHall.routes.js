const { oleCheckJWT } = require("../middleware");
const hall = require("../controllers/cinemaHall.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.post('/api/cinemas/:id/halls', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, hall.addHall)
  app.get('/api/cinemas/:name/halls', hall.getHalls)
  app.get('/api/cinemas/:name/halls/:hallNumber', hall.getHallByHallNumber)
  app.put('/api/cinemas/:id/halls/:hallId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, hall.updateHallsData)
  app.delete('/api/cinemas/:id/halls/:hallId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, hall.deleteHall)

};