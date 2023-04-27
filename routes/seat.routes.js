const { oleCheckJWT } = require("../middleware");
const seat = require("../controllers/seat.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post('/cinema/:id/hall/:hallId/seat', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, seat.addSeat)
  app.get('/cinema/:id/hall/:hallId/seat/', oleCheckJWT.verifyToken, seat.getSeats)
  app.get('/cinema/:id/hall/:hallId/seat/:seatId', oleCheckJWT.verifyToken, seat.getSeatById)
  app.put('/cinema/:id/hall/:hallId/seat/:seatId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, seat.updateSeatData)
  app.delete('/cinema/:id/hall/:hallId/seat/:seatId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, seat.deleteSeat)

};