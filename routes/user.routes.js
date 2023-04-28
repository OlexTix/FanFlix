const { oleCheckJWT } = require("../middleware");
const user = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/api/users', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, user.getUsers)
  app.get('/api/users/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, user.getUserById)
  app.put('/api/users/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, user.updateUserPass)
  app.delete('/api/users/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, user.deleteUser)

};