/**
 * server.js
 * @desc Crea el servidor de la API. El modulo se exporta con el nombre Server
 * La API se sirve haciendo uso de express y se va a habilitar cors
 */
const express = require("express");
var cors = require("cors");

/**
 * Clase que representa el servidor de la API
 */
class Server {
	/**
	 * @constructor
	 * Define las piezas del Servidor:
	 *  - Puerto de entrada
	 * 	- Los paths que se asignarán a las rutas
	 *  - routes: rutas que atenderá en servidor
	 */
	constructor() {
		this.app = express();
		this.port = process.env.PORT;	// Puerto activado para el servidor
		this.usersPath = process.env.BASEAPIPATH + process.env.USERPATH;	// path de atención a autenticación
		this.authPath = process.env.BASEAPIPATH + process.env.AUTHPATH;		// path de atención a usuarios

		// Middlewares
		this.middlewares();

		// Rutas de la aplicación
		this.routes();
	}

	/**
	 * @method middlewares
	 * @desc Define los middlewares que por defecto se asignan al servidor
	 */
	middlewares() {
		// Activacion de la carpeta public (se renderiza ante la peticion /)
		this.app.use(express.static("public"));

		// CORS
		this.app.use(cors());

		// Lectura y parse del body a formato JSON
		this.app.use(express.json());
	}

	/**
	  * @method routes
	  * Define las rutas que atenderá el servicio, incluidas en "../routes"
	  */
	routes() {
		this.app.use(this.authPath, require("../routes/auth"));
		this.app.use(this.usersPath, require("../routes/usuarios"));
		
		// Validador de errores aplicado a express para capturar los errores de Joi
		// Ha de ser el último a asignar
		this.app.use((err, req, res, next) => {
			if (err && err.error && err.error.isJoi) {
				// Llegado acá se tiene un error de Joi
				res.status(400).json({
					// El tipo puede ser "query", "headers", "body" o "params", según origen
					type: err.type,
					message: err.error.toString(),
				});
			} else {
				// Pasa al siguiente manejador de errores
				next(err);
			}
		});
	}

	/**
	 * @method listen
	 * Activa el servidor en el puerto asignado y envía mensaje a consola
	 */
	listen() {
		this.app.listen(this.port, () => {
			console.log(`Servidor corriendo en puerto ${this.port}. Presione Ctrl-C para terminar`);
		});
	}
}

module.exports = Server;
