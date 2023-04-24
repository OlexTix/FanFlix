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
  app.post('/cinema/hall', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, hall.addHall)
  app.get('/cinema/hall', oleCheckJWT.verifyToken, hall.getHalls)
  app.get('/cinema/hall/:id', oleCheckJWT.verifyToken, hall.getHallById)
  app.put('/cinema/hall/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, hall.updateHallsData)
  app.delete('/cinema/hall/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, hall.deleteHall)

};