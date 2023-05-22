const { oleCheckJWT } = require("../../middleware");
const layout = require("../../controllers/panel/panel.hallLayout.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.post(
    "/api/panel/halls/:hallNumber/layout",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    layout.addSeatsToHall
  );
};