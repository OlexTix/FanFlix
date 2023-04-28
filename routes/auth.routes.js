const { oleCheckJWT } = require("../middleware");
const auth = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/api/auth/expiration', oleCheckJWT.verifyToken, auth.checkExpiration)
  app.post('/api/auth/register', auth.registerUser)
  app.post('/api/auth/login', auth.loginUser)
};