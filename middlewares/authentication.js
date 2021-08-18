/*
    Middleware que pemrite autenticar al usuario mediante comprobacion de token
    Además permite validar el rol administrador
*/
const jwt = require("jsonwebtoken");

/** 
 * Verificador del token a ser aplicado en los end points
 * @constant tokenVerify
*/
const tokenVerify = (req, res, next) => {
	let token = req.header("x-token");

	if (!token) {
		res.status(401).json({
			msg: "Sin token ",
		});
		return;
	}

	try {
		const { userId, role } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

		// Se van a colocar los valores en req para uso en el controlador o siguiente validador
		req.authUserId = userId;
		req.authUserRole = role;
		next();
	} catch (err) {
		return res.status(401).json({
			ok: false,
			err: {
				message: "AUTH - ERROR: Token no valido",
			},
		});
	}
};

/** 
 * Verificador del rol administrador en un usuario, a ser aplicado en los end points
 * que requieran que su accion sea ejecutada por un administrador.
 * 
 * Siempre debe ser apalicado después de tokenVerify, puesto que este inyecta en el request 
 * del end point los valores del userId y role obtenidos del token
 * 
 * @constant adminRoleVerify
*/
const adminRoleVerify = (req, res, next) => {
	let role = req.authUserRole;
	let userId = req.authUserId;

	if (role === "ADMIN_ROLE") {
		next();
	} else {
		const error = "Error";
		res.json({
			ok: false,
			err: {
				message: "AUTH - ERROR: El usuario no es administrador",
			},
		});
		next(error);
	}
};

module.exports = {
	tokenVerify,
	adminRoleVerify,
};
