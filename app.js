
// Definicion de las varables de ambiente
require("dotenv").config()

// trae el servidor
const Server = require('./models/server.js')
const server = new Server()

server.listen()
