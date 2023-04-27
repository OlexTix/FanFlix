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

  app.post('/cinemas/:id/halls/:hallId/seats', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, seat.addSeat)
  app.get('/cinemas/:id/halls/:hallId/seats/', oleCheckJWT.verifyToken, seat.getSeats)
  app.get('/cinemas/:id/halls/:hallId/seats/:seatId', oleCheckJWT.verifyToken, seat.getSeatById)
  app.put('/cinemas/:id/halls/:hallId/seats/:seatId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, seat.updateSeatData)
  app.delete('/cinemas/:id/halls/:hallId/seats/:seatId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, seat.deleteSeat)

};