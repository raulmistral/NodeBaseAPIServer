/**
 * auth.js
 * 
 * DEFINE LOS END POINTS DE LA RUTA DE AUTENTICACION (/auth)
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
 * @constant validatorSchemas
 * Obtiene los esquemas de validacion de las entradas al end point. Todos son schemas de Joi
 * Los esquemas son parte de la definición del modelo de usuario (../models/userModel.js)
*/
const {
	loginSchema
} = require("../models/userModel");

/**
 * @constant authControllers
 * Módulos correspondiente con los controladores asociados a los 
 * end points de la ruta /auth
*/
const { login } = require("../controllers/auth")

const router = Router();

/** 
 * End-point. Autentica un usuario. 
 * Espera recibir userId y el nuevo password en query params
*/
router.post(
	"/login",
	validator.query(loginSchema, { passError: true, statusCode: 400 }),
	login
);


module.exports = router;