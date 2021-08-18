/** 
 * auth.js
 * 
 * CONTROLADORES DE LAS RUTAS DE AUTENTICACION (/auth/)
 * Llamado desde cada una de los end points declarados en ../routes/auth.js
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/** 
 * @constant
 * DAO para la base de datos
*/
const Userdbr = require("../dbrepos/usuariodbr.js");

/** 
 * @constant
 * Basada en clase que define la interacción con la API de la BAse de Datos
*/
const AppDAO = require("../models/dao.js");

/** 
 * @method
 * Atiende el end point post /auth/login
 * Realiza una validación de credenciales userId / password
 * 
 * @param userId: ID del usuario
 * @param password: clave del usuario
 * @returns { Object }, type (string), value (integer), message (string), token (string)
 * 	type: el tipo de origen, en este caso api, o server si es error 
 * 	value: 1 - Credenciales válidas / 0 - Credenciales inválidas
 * 	message: mensaje
 * 	token: el token de autenticación. Este token contiene el userId y rol del usuario
 * 
 * Todas los parametros del request vienen desde query
*/
const login = async (req, res) => {
	const dbDAO = new AppDAO("./dbrepos/db/vc.db");
	const userdbr = new Userdbr(dbDAO);
	let allowLogin = 0;
	let message = "";
	let resStatus = 400;
	let token = "";

	const { userId, password } = req.query;

	/*
        PASOS
        1.- Validar que el usuario exista
        2.- Validar que el usuario esta activo
        3.- Validar que el password corresponde con el usuario
        4.- Generar es JWT
    */

	try {
		const retObj = await userdbr.getLoginInfo(userId);

		if (!retObj.result) {
			message = `Usuario ${userId} No existe`;
		} else if (retObj.result.active != 1) {
			message = `Usuario ${userId} está Inactivo`;
		} else {
			const comp = await bcrypt.compare(password, retObj.result.password);
			if (comp) {
				// Si ha llegado hasta aquí, es un usuario autenticado y se genera el token
				const payload = { userId, role: retObj.result.role };
				token = jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
					expiresIn: process.env.TOKENEXPIRATION,
				});
				message = `Usuario ${userId} Autenticado`;
				allowLogin = 1;
				resStatus = 200;
			} else {
				message = `Usuario ${userId} No Autenticado`;
			}
		}

		res.status(resStatus).json({
			type: "api",
			value: allowLogin,
			message,
			token,
		});

		userdbr.close();
	} catch (err) {
		console.error(err)
		res.status(500).json({
			type: "server",
			value: 0,
			message: "Server Error",
			err,
		});
		userdbr.close();
	}
};

module.exports = {
	login,
};
