/*
    API de manejo de usuarios
*/
const bcrypt = require('bcrypt');
const express = require('express')
const validator = require('express-joi-validation').createValidator({})

const { adminRoleVerify, tokenVerify } = require('../middlewares/authentication.js')
const { getUserSchema, User, userSchema, userDB, showUser } = require('../models/userModel.js')

const app = express()

/*
    Obtiene un usuario, dado que se valide que se paso un id y que el token es valido
*/
app.get('/usuario', [validator.query(getUserSchema, {passError: true, statusCode: 400}), tokenVerify], (req, res, next) => {

    let pw = req.query.password;

    

});

/*
    Crea un usuario. Para ello debe validar que los datos del usuario son validos, que el token es valido
    y que el rol del usuario sea de administrador
*/
app.post('/usuario', [validator.query(userSchema, {passError: true, statusCode: 400}), tokenVerify, adminRoleVerify],
                        (req, res) => {

    let usuario = new User (
        req.query.userId,
        req.query.firstName,
        req.query.lastName,
        req.query.password,
        req.query.email,
        req.query.role,
        req.query.active,
        req.query.google
    );

});

/*
    Modifica un usuario dado
*/
app.put('/usuario/:userId', (req, res) => {
    let id = req.params.id

    res.status(200).json({
        id
    })
});

/*
    Marca un usuario como borrado
*/
app.delete('/usuario', (req, res) => {
    res.json('DELETE USER')
});

/*
    Manejador de errores dedicado
*/
app.use((err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        // Aca se detectan errores de Joi, de particular importancia pues el validador se tramita
        // via express-joi-validator
        res.status(400).json({
        type: err.type, // Reporta el tipo de error, que si es de Joi, será query, param, etc
        message: err.error.toString()
        });
    } else {
        // emite el error al siguiente manejador de errores
        next(err);
    }
});


module.exports = app;