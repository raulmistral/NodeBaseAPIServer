/*
    Middleware que pemrite autenticar al usuario mediante comprobacion de token
    Además permite validar el rol administrador
*/
const jwt = require('jsonwebtoken');

/*
    Verifica Token - Autenticacion
*/
let tokenVerify = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'AUTH - ERROR: Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

/*
    Verifica el Role de Administracion 
*/
let adminRoleVerify = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'AUTH - ERROR: El usuario no es administrador'
            }
        });
    }
};


module.exports = {
    tokenVerify,
    adminRoleVerify
}