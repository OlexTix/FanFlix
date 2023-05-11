const { oleCheckJWT } = require("../../middleware");
const tickets = require("../../controllers/panel/panel.tickets.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );



  app.get(
    "/api/panel/tickets",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    tickets.getAllProducts
  );

  app.post(
    "/api/panel/tickets",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    tickets.addTicket
  );
  
  app.put(
    "/api/panel/tickets/:id_ticket",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    tickets.modifyProduct
  );
  
  app.delete(
    "/api/panel/tickets/:id_ticket",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    tickets.deleteProduct
  );
};