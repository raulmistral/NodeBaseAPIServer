/** 
 * usuarios.js
 * 
 * CONTROLADORES DE LAS RUTAS DE USUARIOS (/usuarios/)
 * Llamado desde cada una de los end points declarados en ../routes/usuarios.js.
 * 
 * Los contrroladores de los end points asumen que los datos requeridos son sintácticamente 
 * correcstos, pues ellos han pasado por el validator aplicado a la ruta (ver /routes/usuarios)
 * y definidos en el Moelo de Usuario (ver /models/userModel.js)
 */

const bcrypt = require("bcrypt");

// Articifio para poder referenciar los metodos de res en las constantes a ser declaradas. No es necesario
const { response } = require("express");

/** 
 * @constant
 * Basada en clase que define al usuario
*/
const { User } = require("../models/userModel");

/** 
 * @constant Userdbr
 * DAO para la base de datos
*/
const Userdbr = require("../dbrepos/usuariodbr.js");

/** 
 * @constant AppDAO
 * Basada en clase que define la interacción con la API de la BAse de Datos
*/
const AppDAO = require("../models/dao.js");

/** 
 * @constant usuariosLogin
 * Atiende el end point get /usuarios/login
 * Realiza una validación de credenciales userId / password
 * 
 * @param userId: ID del usuario
 * @param password: clave del usuario
 * @returns { Object }, type (string), value (integer), message (string)
 * 	type: el tipo de origen, en este caso api, o server si es error 
 * 	value: 1 - Credenciales válidas / 0 - Credenciales inválidas
 * 	message: mensaje
 * 
 * Todas los parametros del request vienen desde query
*/
const usuariosLogin = (req, res) => {
	const dbDAO = new AppDAO("./dbrepos/db/vc.db");
	const userdbr = new Userdbr(dbDAO);
	const userId = req.query.userId;
	const password = req.query.password;
	let allowLogin = 0;
	let message = "";

	/*
        PASOS
		1.- Validar que el usuario exista
        2.- Validar que el usuario esta activo
        3.- Validar que el password corresponde con el usuario
        4.- Cierra la conexión a los datos
    */
	userdbr
		.getLoginInfo(userId)
		.then((retObj) => {
			if (retObj.result) {
				if (retObj.result.active == 1) {
					const comp = bcrypt.compareSync(password, retObj.result.password);
					if (comp) {
						message = `Usuario ${userId} Autenticado`;
						allowLogin = 1;
					} else {
						message = `Usuario ${userId} No Autenticado`;
					}
				} else {
					message = `Usuario ${userId} está Inactivo`;
				}
			} else {
				message = `Usuario ${userId} No existe`;
			}
			res.status(200).json({
				type: "api",
				value: allowLogin,
				message,
			});
		})
		.catch((err) => {
			console.error(err)
			res.status(500).json({
				type: "server",
				value: 0,
				message: "Server Error",
				err,
			});
		})
		.then(() => {
			userdbr.close();
		});
};

/** 
 * @constant usuariosGet
 * Atiende el end point get /usuarios/
 * Obtiene un usuario solicitado
 * 
 * @param userId: ID del usuario
 * @returns { Object }, type (string), value (integer), message (string), result (Object)
 * 	type: el tipo de origen, en este caso api, o server si es error 
 * 	value: 1 - Usuario ubicado / 0 - Usuario no existe
 * 	message: mensaje
 * 	result: objeto que contiene la información de usuario
 * 
 * Todas los parametros del request vienen desde query
*/
const usuariosGet = (req, res = response, next) => {
	const dbDAO = new AppDAO("./dbrepos/db/vc.db");
	const userdbr = new Userdbr(dbDAO);
	const userId = req.query.userId;
	let message = `Usuario ${userId} no encontrado`;
	let value = 0;
	let result = {};

	userdbr
		.getUser(userId)
		.then((retObj) => {
			if (retObj.result) {
				message = `Usuario ${userId} encontrado`;
				value = 1;
				result = retObj.result;
			}

			res.status(200).json({
				type: "api",
				value,
				message,
				result,
			});
		})
		.catch((err) => {
			console.error(err)
			res.status(500).json({
				type: "server",
				value: 0,
				message: "Server Error",
				err,
			});
		})
		.then(() => {
			userdbr.close();
		});
};

/** 
 * @constant usuariosAll
 * Atiende el end point get /usuarios/allusers
 * Obtiene la lista de todos los usuarios
 * 
 * @returns { Object }, type (string), value (integer), message (string), result (array[Object])
 * 	type: el tipo de origen, en este caso api, o server si es error 
 * 	value: 1 - Usuaarios ubicados / 0 - No hay usuarios definidos
 * 	message: mensaje
 * 	result: arreglo de objetos que contienes la información de los usuarios
 * 
 * Todas los parametros del request vienen desde query
*/
const usuariosAll = (req, res) => {
	const dbDAO = new AppDAO("./dbrepos/db/vc.db");
	const userdbr = new Userdbr(dbDAO);
	const userId = req.query.userId;
	let message = `No hay Usuarios definidos`;
	let value = 0;
	let result = {};

	userdbr
		.getUsers()
		.then((retObj) => {
			if (retObj.result) {
				message = `Lista de Usuarios construida`;
				value = 1;
				result = retObj.result;
			}

			res.status(200).json({
				type: "api",
				value,
				message,
				result,
			});
		})
		.catch((err) => {
			res.status(500).json({
				type: "server",
				value: 0,
				message: "Server Error",
				err,
			});
		})
		.then(() => {
			userdbr.close();
		});
};

/** 
 * @constant usuariosPut
 * Atiende el end point put /usuarios/
 * Modifica el registro de un usuario dado
 * 
 * @param userId
 * @param firstName
 * @param lastName
 * @param password
 * @param email
 * @param role, "ADMIN_ROLE" / "USER_ROLE"
 * @param active, 1 / 0
 * @param google, 1 / 0
 * @returns { Object }, type (string), value (integer), message (string)
 * 	type: el tipo de origen, en este caso api, o server si es error 
 * 	value: 1 - Usuarios Modificado / 0 - Usuario no existe
 * 	message: mensaje
 * 
 * Todas los parametros del request vienen desde query
*/
const usuariosPut = (req, res) => {
	let usuario = new User(
		req.query.userId,
		req.query.firstName,
		req.query.lastName,
		req.query.password,
		req.query.email,
		req.query.role,
		req.query.active,
		req.query.google
	);

	const dbDAO = new AppDAO("./dbrepos/db/vc.db");
	const userdbr = new Userdbr(dbDAO);
	let message = `Usuario ${usuario.userId} no existe`;
	let value = 0;

	userdbr
		.updateUser(usuario)
		.then((st) => {
			if (st.changes == 1) {
				message = `Usuario ${usuario.userId} Actualizado`;
				value = 1;
			}

			res.status(200).json({
				type: "api",
				value,
				message,
			});
		})
		.catch((err) => {
			res.status(500).json({
				type: "server",
				value: 0,
				message: "Server Error",
				err,
			});
		})
		.then(() => {
			userdbr.close();
		});
};

/** 
 * @constant usuariosActivate
 * Atiende el end point put /usuarios/activate
 * Activa un usuario dado
 * 
 * @param userId
 * @returns { Object }, type (string), value (integer), message (string)
 * 	type: el tipo de origen, en este caso api, o server si es error 
 * 	value: 1 - Usuarios Activado / 0 - Usuario no existe
 * 	message: mensaje
 * 
 * Todas los parametros del request vienen desde query
*/
const usuariosActivate = (req, res) => {
	const dbDAO = new AppDAO("./dbrepos/db/vc.db");
	const userdbr = new Userdbr(dbDAO);
	const userId = req.query.userId;
	let message = `Usuario ${userId} no existe`;
	let value = 0;

	userdbr
		.activateUser(userId)
		.then((st) => {
			if (st.changes == 1) {
				message = `Usuario ${userId} Activado`;
				value = 1;
			}

			res.status(200).json({
				type: "api",
				value,
				message,
			});
		})
		.catch((err) => {
			res.status(500).json({
				type: "server",
				value: 0,
				message: "Server Error",
				err,
			});
		})
		.then(() => {
			userdbr.close();
		});
};

/** 
 * @constant usuariosInactivate
 * Atiende el end point put /usuarios/inactivate
 * Inactiva un usuario dado
 * 
 * @param userId
 * @returns { Object }, type (string), value (integer), message (string)
 * 	type: el tipo de origen, en este caso api, o server si es error 
 * 	value: 1 - Usuarios Inactivado / 0 - Usuario no existe
 * 	message: mensaje
 * 
 * Todas los parametros del request vienen desde query
*/
const usuariosInactivate = (req, res) => {
	const dbDAO = new AppDAO("./dbrepos/db/vc.db");
	const userdbr = new Userdbr(dbDAO);
	const userId = req.query.userId;
	let message = `Usuario ${userId} no existe`;
	let value = 0;

	userdbr
		.inactivateUser(userId)
		.then((st) => {
			if (st.changes == 1) {
				message = `Usuario ${userId} Inactivado`;
				value = 1;
			}

			res.status(200).json({
				type: "api",
				value,
				message,
			});
		})
		.catch((err) => {
			res.status(500).json({
				type: "server",
				value: 0,
				message: "Server Error",
				err,
			});
		})
		.then(() => {
			userdbr.close();
		});
};

/** 
 * @constant usuariosPassword
 * Atiende el end point put /usuarios/password
 * Cambia el password un usuario dado
 * 
 * @param userId
 * @param password
 * @returns { Object }, type (string), value (integer), message (string)
 * 	type: el tipo de origen, en este caso api, o server si es error 
 * 	value: 1 - Usuarios Modificado / 0 - Usuario no existe
 * 	message: mensaje
 * 
 * Todas los parametros del request vienen desde query
*/
const usuariosPassword = (req, res) => {
	const dbDAO = new AppDAO("./dbrepos/db/vc.db");
	const userdbr = new Userdbr(dbDAO);
	const userId = req.query.userId;
	const password = req.query.password;
	let message = `Usuario ${userId} no existe`;
	let value = 0;

	userdbr
		.changePassword(userId, password)
		.then((st) => {
			if (st.changes == 1) {
				message = `Password de ${userId} Actualizado`;
				value = 1;
			}

			res.status(200).json({
				type: "api",
				value,
				message,
			});
		})
		.catch((err) => {
			res.status(500).json({
				type: "server",
				value: 0,
				message: "Server Error",
				err,
			});
		})
		.then(() => {
			userdbr.close();
		});
};

/** 
 * @constant usuariosPost
 * Atiende el end point post /usuarios/
 * Crea el registro de un usuario dado
 * 
 * @param userId
 * @param firstName
 * @param lastName
 * @param password
 * @param email
 * @param role, "ADMIN_ROLE" / "USER_ROLE"
 * @param active, 1 / 0
 * @param google, 1 / 0
 * @returns { Object }, type (string), value (integer), message (string)
 * 	type: el tipo de origen, en este caso api, o server si es error 
 * 	value: 1 - Usuarios Modificado / 0 - Usuario no existe
 * 	message: mensaje
 * 
 * Todas los parametros del request vienen desde query
*/
const usuariosPost = (req, res) => {
	let usuario = new User(
		req.query.userId,
		req.query.firstName,
		req.query.lastName,
		req.query.password,
		req.query.email,
		req.query.role,
		req.query.active,
		req.query.google
	);

	const dbDAO = new AppDAO("./dbrepos/db/vc.db");
	const userdbr = new Userdbr(dbDAO);

	userdbr
		.insertUser(usuario)
		.then((st) => {
			res.status(201).json({
				type: "api",
				value: 0,
				message: `Usuario ${usuario.userId} Ingresado en Base de Datos`,
				result: usuario,
			});
		})
		.catch((err) => {
			res.status(500).json({
				type: "server",
				value: 0,
				message: "Server Error",
				err,
			});
		})
		.then(() => {
			userdbr.close();
		});
};

/** 
 * @constant usuariosDelete
 * Atiende el end point delete /usuarios
 * END POINT DE PRUEBA.
 * Permite probar el funcionamiento de la verificación de token y del rol administrador
 * Todos los end points deberán estar protegidos por el token, mínimo
 * 
 * @param x-token
 * @returns { Object }, type (string), message (string), user (string), role (string)
 * 	type: el tipo de origen, en este caso api, o server si es error 
 * 	message: mensaje
 * 	user: usuario capturado en el validador del token. Se asume que ese datos viene en el token
 * 	role: role del usuario capturado en el validador del token. Se asume que ese datos viene en el token
 * 
 * Todas los parametros del request vienen desde query
*/
const usuariosDelete = (req, res) => {
	res.json({
		type: "api",
		message: "delete API - controlador",
		user: req.authUserId,
		role: req.authUserRole
	});
};

module.exports = {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosDelete,
	usuariosAll,
	usuariosActivate,
	usuariosInactivate,
	usuariosPassword,
	usuariosLogin,
};
