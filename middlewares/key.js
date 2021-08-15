/*
    Middleware para validar que la clave usada para buscar las ventas tenga formato correcto
    En el caso de las ventas, la clave es el dia como string en formato AAAAMMDD
    Tiene validez desde el 2020 hasta el 2029
*/
let keyValidator = (req, res, next) => {

    let valid = /(202[0-9])(0[1-9]|1[0-2])([0-2][0-9]|3[0-1])/.test(req.query.dia) || 
                (req.query.dia) == '' ||
                (req.query.dia) == undefined

    if (valid) {
        next()
    } else {
        return res.status(400).json({
            ok: false,
            message: 'Identificador de dia invalido'
        })
    }
};

module.exports = {
    keyValidator
}