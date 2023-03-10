require('dotenv').config();

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DATABASE_USER_NAME,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
})

const getUsers = (req, res) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getUserById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const createUser = (req, res) => {
  const { name, email, password, roles } = req.body

  pool.query('INSERT INTO users (name, email, password, roles) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, password,  roles], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
}

const updateUserPass = (req, res) => {
  const id = parseInt(req.params.id)
  const { password } = req.body

  pool.query(
    'UPDATE users SET password = $1 WHERE id = $2',
    [password, id],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`User's password modified with ID: ${id}`)
    }
  )
}

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserPass,
  deleteUser,
}