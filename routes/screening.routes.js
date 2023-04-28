const { oleCheckJWT } = require("../middleware");
const screening = require("../controllers/screening.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(cors({
    origin: "*",
    allowedHeaders: "x-access-token, Origin, Content-Type, Accept"
  }));
  
  app.post('/api/cinemas/:id/halls', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, screening.addScreening)
  app.get('/api/cinemas/:name/halls', screening.getScreening)
  app.get('/api/cinemas/:name/halls/:hallNumber', screening.getScreeningByName)
  app.put('/api/cinemas/:id/halls/:hallId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, screening.updateScreeningsData)
  app.delete('/api/cinemas/:id/halls/:hallId', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, screening.deleteScreening)

};