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
  app.post('/cinema/:id/hall', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, hall.addHall)
  app.get('/cinema/:id/hall', oleCheckJWT.verifyToken, hall.getHalls)
  app.get('/cinema/:id/hall/:hallId', oleCheckJWT.verifyToken, hall.getHallById)
  app.put('/cinema/:id/hall/:hallId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, hall.updateHallsData)
  app.delete('/cinema/:id/hall/:hallId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, hall.deleteHall)

};