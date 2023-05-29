const { oleCheckJWT } = require("../middleware");
const screeningTypes = require("../controllers/screeningTypes.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.get("/api/screeningTypes", screeningTypes.getScreeningTypes);
};