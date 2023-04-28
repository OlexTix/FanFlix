const { oleCheckJWT } = require("../middleware");
const seat = require("../controllers/seat.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.post('/api/cinemas/:id/halls/:hallId/seats', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, seat.addSeat)
  app.get('/api/cinemas/:name/halls/:hallNumber/seats/', seat.getSeats)
  app.get('/api/cinemas/:name/halls/:hallNumber/seats/:seatNumber', seat.getSeatById)
  app.put('/api/cinemas/:id/halls/:hallId/seats/:seatId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, seat.updateSeatData)
  app.delete('/api/cinemas/:id/halls/:hallId/seats/:seatId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, seat.deleteSeat)

};