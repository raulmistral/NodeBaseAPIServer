// Articifio para poder referenciar los metodos de res en las constantes a ser declaradas. No es necesario
const { response } = require('express')
const { User } = require('../models/userModel')
const Userdbr = require('../dbrepos/usuariodbr.js')
const AppDAO = require('../models/dao.js')


// Devuelve un usuario dado su userId
const usuariosGet = (req, res = response) => {

    const dbDAO = new AppDAO('./dbrepos/db/vc.db')
    const userdbr = new Userdbr(dbDAO)
    const userId = req.query.userId

    userdbr.getUser(userId)
        .then((retObj) => {
            retObj.result ? msg = `Usuario ${userId} encontrado` : msg = `Usuario ${userId} no encontrado` 
            res.status(200).json({
                msg,
                retObj,
            })
        })
        .catch ((err) => {
            res.status(409).json({
                msg: 'Error en Base de Datos',
                err
            })
        })
        .then(() => {
            userdbr.close()
        })
}

// Devuelve todos los usuarios
const usuariosAll = (req, res) => {

    const dbDAO = new AppDAO('./dbrepos/db/vc.db')
    const userdbr = new Userdbr(dbDAO)
    const userId = req.query.userId

    userdbr.getUsers()
        .then((retObj) => {
            retObj.result ? msg = `Lista de Usuarios construida` : msg = `No hay Usuarios definidos` 
            res.status(200).json({
                msg,
                retObj,
            })
        })
        .catch ((err) => {
            res.status(409).json({
                msg: 'Error en Base de Datos',
                err
            })
        })
        .then(() => {
            userdbr.close()
        })
}

// Modifica usuarios
const usuariosPut = (req, res) => {

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
    
    const dbDAO = new AppDAO('./dbrepos/db/vc.db')
    const userdbr = new Userdbr(dbDAO)

    userdbr.updateUser(usuario)
        .then((st) => {
            if(st.changes ==1) {
                res.status(200).json({
                    msg: `Usuario ${usuario.userId} Actualizado`,
                    st
                })
            } else {
                res.status(200).json({
                    msg: `Usuario ${usuario.userId} no existe`,
                    st
                })
            }
        })
        .catch ((err) => {
            res.status(409).json({
                msg: 'Usuario rechazado',
                err
            })
        })
        .then(() => {
            userdbr.close()
        })
}

// Activa un usuario dado su userId
const usuariosActivate = (req, res) => {

    const dbDAO = new AppDAO('./dbrepos/db/vc.db')
    const userdbr = new Userdbr(dbDAO)
    const userId = req.query.userId

    userdbr.activateUser(userId)
        .then((st) => {
            if(st.changes ==1) {
                res.status(200).json({
                    msg: `Usuario ${userId} Activado`,
                    st
                })
            } else {
                res.status(200).json({
                    msg: `Usuario ${userId} no existe`,
                    st
                })
            }
        })
        .catch ((err) => {
            res.status(409).json({
                msg: 'Usuario rechazado',
                err
            })
        })
        .then(() => {
            userdbr.close()
        })
}

// Inactiva un usuario dado su userId
const usuariosInactivate = (req, res) => {

    const dbDAO = new AppDAO('./dbrepos/db/vc.db')
    const userdbr = new Userdbr(dbDAO)
    const userId = req.query.userId

    userdbr.inactivateUser(userId)
        .then((st) => {
            if(st.changes ==1) {
                res.status(200).json({
                    msg: `Usuario ${userId} Inactivado`,
                    st
                })
            } else {
                res.status(200).json({
                    msg: `Usuario ${userId} no existe`,
                    st
                })
            }
        })
        .catch ((err) => {
            res.status(409).json({
                msg: 'Usuario rechazado',
                err
            })
        })
        .then(() => {
            userdbr.close()
        })
}

const usuariosPassword = (req, res) => {
    const dbDAO = new AppDAO('./dbrepos/db/vc.db')
    const userdbr = new Userdbr(dbDAO)
    const userId = req.query.userId
    const password = req.query.password

    userdbr.changePassword(userId, password)
        .then((st) => {
            if(st.changes ==1) {
                res.status(200).json({
                    msg: `Password de ${userId} Actualizado`,
                    st
                })
            } else {
                res.status(200).json({
                    msg: `Usuario ${userId} no existe`,
                    st
                })
            }
        })
        .catch ((err) => {
            res.status(409).json({
                msg: 'Usuario rechazado',
                err
            })
        })
        .then(() => {
            userdbr.close()
        })
}

// Crea un usuario
const usuariosPost = (req, res) => {

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
    
    const dbDAO = new AppDAO('./dbrepos/db/vc.db')
    const userdbr = new Userdbr(dbDAO)

    userdbr.insertUser(usuario)
        .then((st) => {
            res.status(201).json({
                msg: 'Usuario Ingresado en Base de Datos',
                usuario,
                st
            })
        })
        .catch ((err) => {
            res.status(409).json({
                msg: 'Usuario rechazado',
                usuario,
                err
            })
        })
        .then(() => {
            userdbr.close()
        })
    
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: 'delete API - controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosAll,
    usuariosActivate,
    usuariosInactivate,
    usuariosPassword
}