/*
    MODELO DEL USUARIO
*/
const Joi = require('joi')
const bcrypt = require('bcrypt');

/*
    Esquema de validacion del registro de creacion de usuario
*/
const userSchema = Joi.object({
                    userId: Joi.string()
                                .alphanum()
                                .min(6)
                                .max(20)
                                .required(),
                    
                    firstName: Joi.string()
                                .alphanum()
                                .min(1)
                                .max(30)
                                .required(),

                    lastName: Joi.string()
                                .alphanum()
                                .min(1)
                                .max(30)
                                .required(),

                    password: Joi.string()
                                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')),

                    email: Joi.string()
                                .email()
                                .required(),
                    //            .pattern(new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'i')),

                    role: Joi.string()
                                .valid('USER_ROLE', 'ADMIN_ROLE')
                                .uppercase()
                                .default('USER_ROLE'),
                    
                    active: Joi.number()
                                .integer()
                                .min(0)
                                .max(1)
                                .default(1),

                    google: Joi.number()
                                .integer()
                                .min(0)
                                .max(1)
                                .default(0),
                                
                });
                

/*
    Esquema de validacion del id previsto para ubicar un usuario
*/
const getUserSchema = Joi.object({
                userId: Joi.string()
                    .alphanum()
                    .min(6)
                    .max(30)
                    .required()
                });

/*
    Esquema de validacion del password previsto para ubicar un usuario
*/
const getPasswordSchema = Joi.object({
                userId: Joi.string()
                        .alphanum()
                        .min(6)
                        .max(30)
                        .required(),
                        
                password: Joi.string()
                    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})'))
                });

/*
    Esquema de validacion de los datos de login para auteticarse y obtener token
*/
const loginSchema = Joi.object({
                userId: Joi.string()
                    .alphanum()
                    .min(6)
                    .max(30)
                    .required(),

                password: Joi.string().required()
                });

/*
    Provee la informacion que se debe mostrar de un usuario (ej.: sin password)
*/
let showUser = (user) => {
    userRet = Object.assign({}, user);
    delete userRet.password;
    return userRet;
}

/*
    Clase para construir un usuario
*/
class User {
    constructor(userId, firstName, lastName, password, email, role, active, google) {
        this.userId = userId
        this.firstName = firstName
        this.lastName = lastName
        this.password = bcrypt.hashSync(password, 10) 
        this.email = email
        this.role = role
        this.active = active
        this.google = google
    }
}

module.exports = {
    getUserSchema,
    getPasswordSchema,
    loginSchema,
    userSchema,
    User,
    showUser
}