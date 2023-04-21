const { oleCheckJWT } = require("../middleware");
const auth = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/auth/expiration', oleCheckJWT.verifyToken, auth.checkExpiration)
  app.post('/auth/register', auth.registerUser)
  app.post('/auth/login', auth.loginUser)
};