const { oleCheckJWT } = require("../middleware");
const user = require("../controllers/user.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(cors({
    origin: "*",
    allowedHeaders: "x-access-token, Origin, Content-Type, Accept"
  }));

  app.get('/api/users', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, user.getUsers)
  app.get('/api/users/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, user.getUserById)
  app.put('/api/users/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, user.updateUserPass)
  app.delete('/api/users/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, user.deleteUser)

};