/**
 * usurios.js
 * 
 * DEFINE LOS END POINTS DE LA RUTA DE USUARIOS (/usuarios)
 * Llamado desde ../server/Server
 * 
 * @todo Agregar el validadro de token (tokenVerify) en todos los end points (Ver /delete)
 * @todo Agregar el validador de rol (adminRoleVerify) en los end points que sea necesario (Ver /delete)
 */

const { Router } = require("express");

/**
 * @constant validator
 * Incluye el validador de Joi para express
*/
const validator = require("express-joi-validation").createValidator({});

/**
 * @constant validationSchemas
 * Obtiene los esquemas de validacion de las entradas al end point. Todos son schemas de Joi
 * Los esquemas son parte de la definición del modelo de usuario (../models/userModel.js)
*/
const {
	getUserSchema,
	getPasswordSchema,
	loginSchema,
	userSchema,
} = require("../models/userModel");

/**
 * @constant userControllers
 * Módulos correspondiente con los controladores asociados a los 
 * end points de la ruta /usuarios
*/
const {
	usuariosPut,
	usuariosGet,
	usuariosPost,
	usuariosDelete,
	usuariosAll,
	usuariosActivate,
	usuariosInactivate,
	usuariosPassword,
	usuariosLogin,
} = require("../controllers/usuarios");

/**
 * @constant authMiddlewares
 * Validadores de autenticación
*/
const {
	tokenVerify,
	adminRoleVerify,
} = require("../middlewares/authentication");

const router = Router();

/** 
 * End-point. Entrega información del usuario. 
 * Espera recibir userID en query params 
 */
router.get(
	"/",
	validator.query(getUserSchema, { passError: true, statusCode: 400 }),
	usuariosGet
);

/** 
 * End-point. Valida información de usuario y password. 
 * Espera recibir userId y password en query params
*/
router.get(
	"/login/",
	validator.query(loginSchema, { passError: true, statusCode: 400 }),
	usuariosLogin
);

/** 
 * End-point. Entrega todos los usuarios. 
*/
router.get("/allusers/", usuariosAll);

/** 
 * End-point. Ingresa un nuevo usuario. 
 * Todos los elementos de definición van vía query params
*/
router.put(
	"/",
	validator.query(userSchema, { passError: true, statusCode: 400 }),
	usuariosPut
);

/** 
 * End-point. Activa un usuario. 
 * Espera recibir userId en query params
*/
router.put(
	"/activate/",
	validator.query(getUserSchema, { passError: true, statusCode: 400 }),
	usuariosActivate
);

/** 
 * End-point. Inactiva un usuario. 
 * Espera recibir userId en query params
*/
router.put(
	"/inactivate/",
	validator.query(getUserSchema, { passError: true, statusCode: 400 }),
	usuariosInactivate
);

/** 
 * End-point. Actualiza el password de un usuario. 
 * Espera recibir userId y el nuevo password en query params
*/
router.put(
	"/password/",
	validator.query(getPasswordSchema, { passError: true, statusCode: 400 }),
	usuariosPassword
);

/** 
 * End-point. Actualiza la informacion de un usuario. 
 * Espera recibir los mismos datos necesarios para crear al usuario en query params
*/
router.post(
	"/",
	validator.query(userSchema, { passError: true, statusCode: 400 }),
	usuariosPost
);

/** 
 * End-point. Es un end point de prueba. 
 * En este caso está validando token de autenticación y rol administrador. 
 * Espera recibir x-token (el token) en el header de la perición.
 * Una vez obtenido el token, tokenVerify transmite el role al validador adminRoleVerify
*/
router.delete("/", [tokenVerify, adminRoleVerify], usuariosDelete);

module.exports = router;
