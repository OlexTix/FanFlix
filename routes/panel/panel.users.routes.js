const { oleCheckJWT } = require("../../middleware");
const user = require("../../controllers/panel/panel.users.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.get(
    "/api/panel/users",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    user.getUsers
  );
  app.put(
    "/api/users/:id/reset",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    user.resetPassword
  );
  app.put(
    "/api/panel/users/:id",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    user.updateUser
  );
  app.delete(
    "/api/panel/users/:id",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    user.deleteUser
  );

};
