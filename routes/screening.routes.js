const { oleCheckJWT } = require("../middleware");
const screening = require("../controllers/screening.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(cors({
    origin: "*",
    allowedHeaders: "x-access-token, Origin, Content-Type, Accept"
  }));
  
  app.post('/api/cinemas/:id/halls/:hallNumber/screenings', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, screening.addScreening)
  app.get('/api/cinemas/:name/screenings', screening.getScreenings)
  app.get('/api/cinemas/:name/screenings/:screeningName', screening.getScreeningByName)
  app.put('/api/cinemas/:id/halls/:hallNumber/screenings/:screeningId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, screening.updateScreeningsData)
  app.delete('/api/cinemas/:id/halls/:hallNumber/screenings/:screeningId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, screening.deleteScreening)

};