require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
//parse request of content type json
app.use(express.json());
//parse request of content type x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/cinema.routes")(app);
require("./routes/cinemaHall.routes")(app);
require("./routes/seat.routes")(app);
require("./routes/movie.routes")(app);
require("./routes/screening.routes")(app);

const PORT = process.env.PORT || 3000;

if (app.listen(PORT)) {
  console.log(`Server started on port ${PORT}.`);
} else {
  console.log(`Server couldn't start on port ${PORT}.`);
}
