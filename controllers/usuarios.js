// Articifio para pode rreferenciar los metodos de res en las constantes a ser declaradas. No es necesario
const { response } = require('express')

const usuariosGet = (req, res = response) => {
    const { q, name = 'No name', apikey, page ='1', limit} = req.query

    res.json({
        msg: 'get API - controlador',
        q,
        name,
        apikey,
        page,
        limit
    })
}

const usuariosPut = (req, res) => {
    //const id = req.params.id  // Es equivamente a la de abajo, pero aquella extrae varios parametros
    const { id } = req.params
    res.json({
        msg: 'put API - controlador',
        id
    })
}

// Crear recursos
const usuariosPost = (req, res) => {
    // Pudise estar envianod en body muchos campos, pero solo tomara los destructurados
    const { nombre, edad } = req.body

    res.status(201).json({
        msg: 'post API - controlador',
        nombre,
        edad
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
    usuariosDelete
}