/** 
 * userModel.js
 * 
 * MODELO DEL USUARIO
 * 
 * Contiene la Clase que define al usuario así como los esquemas de vcalidacion 
 * sobre los intercambios de información de usuario.
 * 
 * Los esquemas de validación se usaran en las rutas (ver /routes/usaurios.js) usando el validator
 * del paquete express-joi-validator. De esta manera, la lógica del controlador del end point podrá 
 * asumir que los datos que le llegan están validados sintácticamente
 */
const Joi = require("joi");
const bcrypt = require("bcrypt");

/** 
 * @constant userSchema
 * Esquema de validación de los datos de usuario para armar su creación o modificación
 * Por defecto (en caso de no ser provisto el valor) se asume que el rol es USER_ROLE
 * que active es 1 y google (identificador de que la autenticación se hace a través de google) es 1 
*/
const userSchema = Joi.object({
	userId: Joi.string().alphanum().min(6).max(20).required(),

	firstName: Joi.string().alphanum().min(1).max(30).required(),

	lastName: Joi.string().alphanum().min(1).max(30).required(),

	password: Joi.string().pattern(
		new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
	),

	email: Joi.string().email().required(),
	//   .pattern(new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'i')),

	role: Joi.string()
		.valid("USER_ROLE", "ADMIN_ROLE")
		.uppercase()
		.default("USER_ROLE"),

	active: Joi.number().integer().min(0).max(1).default(1),

	google: Joi.number().integer().min(0).max(1).default(0),
});

/** 
 * @constant getUserSchema
 * Esquema de validación del userId, es decir, el ID de usuario
*/
const getUserSchema = Joi.object({
	userId: Joi.string().alphanum().min(6).max(30).required(),
});

/** 
 * @constant getPasswordSchema
 * Esquema de validación del userId, es decir, el ID de usuario, y el password según reglas de seguridad
 * Este validador se usa para hacer cambio de password
*/
const getPasswordSchema = Joi.object({
	userId: Joi.string().alphanum().min(6).max(30).required(),

	password: Joi.string()
		.pattern(
			new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
		)
		.required(),
});

/*
    Esquema de validacion de los datos de login para auteticarse y obtener token
*/
/** 
 * @constant loginSchema
 * Esquema de validación del userId, es decir, el ID de usuario, y el password 
 * para hacer la autenticación y obtener un token
*/
const loginSchema = Joi.object({
	userId: Joi.string().required(),

	password: Joi.string().required(),
});

/** 
 * @class User
 * Define al usuario
*/
class User {
	/** 
	 * @constructor
	 * 
	 * @param {string} userId: ID del usuario (6 - 20 caracteres)
	 * @param {string} firstName: Nombre (1 - 30 caracteres)
	 * @param {string} lastName: Apellido (1 - 30 caracteres)
	 * @param {string} password: según regex \^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})\
	 * @param {string} email: correo electronico
	 * @param {string} role: Rol del usuario(ADMIN_ROLE, USER_ROLE)
	 * @param {number} active: Estado de usuario - 1 Activo / 0 Inactivo
	 * @param {number} google: Método de autenticación - 1 Cuenta Google / 0 token propio
	*/
	constructor(
		userId,
		firstName,
		lastName,
		password,
		email,
		role,
		active,
		google
	) {
		this.userId = userId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.password = bcrypt.hashSync(password, 10);
		this.email = email;
		this.role = role;
		this.active = active;
		this.google = google;
	}
}

module.exports = {
	getUserSchema,
	getPasswordSchema,
	loginSchema,
	userSchema,
	User,
};
