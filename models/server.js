const express = require('express')
var cors = require('cors')

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.baseApi = process.env.BASEAPI 
        this.usersPath = '/usuarios'
        
        // Middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes()
    }

    middlewares() {
        // Activacion de la carpeta public (se renderiza ante la peticion /)
        this.app.use(express.static('public'))

        // CORS
        this.app.use(cors())

        // Lectura y parse del body a formato JSON
        this.app.use( express.json() )
    }

    routes() {
        this.app.use('/api/usuarios', require('../routes/usuarios'))
        this.app.use(this.baseApi + this.usersPath, require('../routes/usuarios'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Servidor correindo en  puerto ", this.port)
        })
    }

}


module.exports = Server