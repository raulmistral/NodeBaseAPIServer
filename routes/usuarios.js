const { Router } = require('express')
const validator = require('express-joi-validation').createValidator({})
const { getUserSchema, getPasswordSchema, userSchema } = require('../models/userModel')
const { usuariosPut, usuariosGet, usuariosPost, 
        usuariosDelete, usuariosAll, usuariosActivate, usuariosInactivate,
        usuariosPassword } = require('../controllers/usuarios')

const router = Router()

router.get('/', validator.query(getUserSchema), usuariosGet)

router.get('/allusers/', usuariosAll)

router.put('/', validator.query(userSchema), usuariosPut)

router.put('/activate/', validator.query(getUserSchema), usuariosActivate)

router.put('/inactivate/', validator.query(getUserSchema), usuariosInactivate)

router.put('/password/', validator.query(getPasswordSchema), usuariosPassword)

router.post('/', validator.query(userSchema), usuariosPost)

router.delete('/', usuariosDelete)

module.exports = router