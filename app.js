/**
 * @desc Punto de antrada a la aplicación de exposición de API. Solo llama al servidor - server
 * @version 0.1
 * @author Raul Roldan
*/

// Definicion de las varables de ambiente
require("dotenv").config()

try {
    const Server = require('./models/server.js')
    const server = new Server()

    server.listen()
}catch(err){
    console.err("No se pudo levantar el servidor")
    console.err(`Error ${err.message} `)
}

