const { oleCheckJWT } = require("../../middleware");
const genreController = require("../../controllers/panel/panel.genre.controller");

const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "*",
      allowedHeaders: "x-access-token, Origin, Content-Type, Accept",
    })
  );

  app.post(
    "/api/panel/genres",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    genreController.addGenre
  );
  app.put(
    "/api/panel/genres/:id",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    genreController.updateGenre
  );
  app.delete(
    "/api/panel/genres/:id",
    oleCheckJWT.verifyToken,
    oleCheckJWT.isAdmin,
    genreController.deleteGenre
  );
};
