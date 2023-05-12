const { oleCheckJWT } = require("../middleware");
const checkout = require("../controllers/checkout.controller");
const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.post("/api/checkout", checkout.processCheckout);
  app.post("/api/checkout/webhook", checkout.handleStripeWebhook);

};