const layout = require("../controllers/hallLayout.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );
  
  app.get("/api/halls/layout", layout.getHallLayout);
  
};