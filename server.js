// npm init -y, npm install express
// npm install dotenv
// npm install mongoose

// "proxy": "http://localhost:4000", in frontend package.json
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const commandsRoutes = require('./routes/commands')

// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method,)
  next()
})

app.use(express.json());

// 🔎 debug route
app.get('/ping', (req, res) => {
  res.send('pong')
})


// routes
app.use('/api', commandsRoutes)

// mongoose connect to mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, "0.0.0.0", () => {
            console.log('connected to db & listening on port ', process.env.PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })