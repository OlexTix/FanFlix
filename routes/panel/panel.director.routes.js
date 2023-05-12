const { oleCheckJWT } = require("../middleware");
const director = require("../../controllers/panel/panel.director.controller");
const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.get("/api/panel/director", director.getDirectors);

};