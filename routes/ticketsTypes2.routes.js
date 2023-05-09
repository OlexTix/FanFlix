const { oleCheckJWT } = require("../middleware");
const ticketTypes = require("../controllers/ticketTypes2.controller");
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
    "/api/ticketTypes",
    ticketTypes.getTicketTypes
  );
};