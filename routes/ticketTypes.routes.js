const { oleCheckJWT } = require("../middleware");
const ticketTypes = require("../controllers/ticketTypes.controller");
const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  // Get ticket types
  app.get(
    "/api/cinemas/:name/screenings/:screeningName/ticketTypes",
    ticketTypes.getTicketTypes
  );

  // Save selected ticket types and their quantities
  app.post(
    "/api/cinemas/:name/screenings/:screeningName/saveTicketSelection",
    oleCheckJWT.verifyToken,
    ticketTypes.saveSelectedTicketTypes
  );
};