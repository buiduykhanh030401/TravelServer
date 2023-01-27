const path = require('path')
const express = require('express')
const cors = require('cors')

require('dotenv').config()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const route = require('./routes')
const db = require('./database/config/config')
const socketio = require('./socketio')

const port = 80


app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000', 'https://api.travels.games', 'http://localhost'],
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//connect db
db.connect()
socketio.connect(io)

// Middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Template engine
app.use(express.static(path.join(__dirname, 'resources/views')));

// route
route(app)

server.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

// app.use(cors({
//   credentials: true,
//   origin: 'https://api.travels.games', //https://api.travels.games - http://localhost
// }))


// set origin
// var origins = ['http://localhost:3000', 'https://api.travels.games', 'http://localhost']
// var corsOptions = {
//   credentials: true,
//   origin: (origin, callback) => {
//     console.log(origin);
//     if (origins.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
// app.use(cors(corsOptions))