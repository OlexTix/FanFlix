const { oleCheckJWT } = require("../../middleware");
const screeningTypes = require("../../controllers/panel/panel.screeningTypes.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.post("/api/panel/screeningTypes", oleCheckJWT.verifyToken,
  oleCheckJWT.isAdmin, screeningTypes.addScreeningType);
  app.put("/api/panel/screeningTypes/:id", oleCheckJWT.verifyToken,
  oleCheckJWT.isAdmin, screeningTypes.updateScreeningType);
  app.delete("/api/panel/screeningTypes/:id", oleCheckJWT.verifyToken,
  oleCheckJWT.isAdmin, screeningTypes.addScreeningType);
};