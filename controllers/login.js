/*
    Permite hacer la autenticacion de un usuario y devolverle el token que
    usara luego para autenticarse
*/
const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const validator = require('express-joi-validation').createValidator({})

const { dbRoute } = require('../service_modules/utilServices.js')
const { loginSchema, User, userSchema, showUser } = require('../models/userModel.js')

const app = express()

app.post('/login', validator.query(loginSchema, {passError: true, statusCode: 400}), (req,res) => {

    const PouchDB = require('pouchdb');
    const db = new PouchDB(`${dbRoute(process.env.DBUSER, process.env.DBPW, process.env.DBIP, process.env.DBPORT)}/faouser`);
    let pw = req.query.password;

    db.get(req.query.userId)
        .then((user) => {
            
            if(!bcrypt.compareSync(req.query.password, user.password)) {
                return  res.status(400).json({
                            ok: false,
                            err: 'LOGIN - ERROR: Usuario o clave no coinciden'
                        })
            }

            let userToken = showUser(user)

            let token = jwt.sign({ usuario: userToken }, 
                                    process.env.SEED,
                                    {expiresIn: process.env.CADUCIDAD_TOKEN})

            res.status(200).json({
                        ok: true,
                        usuario: userToken,
                        token
                    })
        })
        .catch((err) => {
            let msg = ''
            if(err.status == 404) {
                msg = 'Identificador de usuario no existe'
            } else {
                msg = err.message
            }
            console.log(`LOGIN - Error: ${err.status} -  ${msg}`)

            res.status(err.status).json({
                ok: false,
                message: msg
            })
        })
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