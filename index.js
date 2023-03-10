require("dotenv").config();
const cors = require("cors");
const express = require("express");
const db = require('./controllers/queries')

const app = express();

app.use(cors());
//parse request of content type json
app.use(express.json());
//parse request of content type x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ info: 'Home Site' })
})
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUserPass)
app.delete('/users/:id', db.deleteUser)

const PORT = process.env.PORT || 3000

if (app.listen(PORT)) {
    console.log(`Server started on port ${PORT} .`);
} else {
    console.log(`Server couldn't start on port ${PORT} .`);
}