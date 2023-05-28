require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  express.json({
    verify: function(req, res, buf) {
      req.rawBody = buf.toString();
    },
  })
);
//parse request of content type x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("./routes/auth.routes")(app);
require("./routes/panel/panel.users.routes")(app);
require("./routes/cinema.routes")(app);
require("./routes/cinemaHall.routes")(app);
require("./routes/seat.routes")(app);
require("./routes/movie.routes")(app);
require("./routes/screening.routes")(app);
require("./routes/screenings.routes")(app);
require("./routes/ticketTypes.routes")(app);
require("./routes/checkout.routes")(app);
require("./routes/hallLayout.routes")(app);
require("./routes/genre.routes")(app);
require("./routes/panel/panel.tickets.routes")(app);
require("./routes/panel/panel.cinema.routes")(app);
require("./routes/panel/panel.halls.routes")(app);
require("./routes/panel/panel.movies.routes")(app);
require("./routes/panel/panel.screening.routes")(app);
require("./routes/panel/panel.director.routes")(app);
require("./routes/panel/panel.hallLayout.routes")(app);

const PORT = process.env.PORT || 3000;

if (app.listen(PORT)) {
  console.log(`Server started on port ${PORT}.`);
} else {
  console.log(`Server couldn't start on port ${PORT}.`);
}
