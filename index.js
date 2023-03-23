require("dotenv").config();
const cors = require("cors");
const express = require("express");
const db = require('./controllers/queries')
const { oleCheckJWT } = require("./middleware");

const app = express();

app.use(cors());
//parse request of content type json
app.use(express.json());
//parse request of content type x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ info: 'Home Site' })
})
app.get('/users', oleCheckJWT.verifyToken, db.getUsers)
app.get('/users/:id', oleCheckJWT.verifyToken, db.getUserById)
app.post('/users/register', db.registerUser)
app.post('/users/login', db.loginUser)
app.put('/users/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, db.updateUserPass)
app.delete('/users/:id', oleCheckJWT.verifyToken, oleCheckJWT.isAdmin, db.deleteUser)

const PORT = process.env.PORT || 3000

if (app.listen(PORT)) {
    console.log(`Server started on port ${PORT} .`);
} else {
    console.log(`Server couldn't start on port ${PORT} .`);
}