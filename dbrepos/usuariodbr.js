/** 
 * IMPLANTACIÓN DEL DAO DE USUARIOS
 * 
 * Llamado desde el controlador de los end points de usuarios (/controllers/usuarios)
*/
const bcrypt = require("bcrypt");

/**
 * Define el DAO para las interacciones de base de datos de usuarios
 *
 * @class Userdbr
 */
class Userdbr {
	/**
	 * Crea una imstancia de Userdbr.
	 * @constructor
	 * 
	 * @param {Dao} dao - objeto definido para interactuar con la base de datos
	 * @memberof Userdbr
	 */
	constructor(dao) {
		this.dao = dao;
		this.userTable = process.env.USERTABLE;
	}

	/**
	 * Crea la tabla de usuarios
	 * @method createTable
	 *
	 * @returns
	 * @memberof Userdbr
	 */
	createTable() {
		const sql = `
			CREATE TABLE IF NOT EXISTS ${this.userTable} (
				userid 		TEXT(20) 	PRIMARY KEY,
				firstName 	TEXT(30) 	NOT NULL,
				lastName 	TEXT(30) 	NOT NULL,
				password 	TEXT(30) 	NOT NULL,
				email 		TEXT(30) 	NOT NULL,
				role 		TEXT(30) 	NOT NULL,
				active 		INTEGER(1) 	NOT NULL,
				google 		INTEGER(1) 	NOT NULL
			`;
		return this.dao.run(sql);
	}

	/**
	 * Elimina la tabla de usuarios
	 * @method dropTable
	 *
	 * @returns
	 * @memberof Userdbr
	 */
	dropTable() {
		const sql = `
			DROP TABLE IF EXISTS ${this.userTable}
		`;
		return this.dao.run(sql);
	}

	/**
	 * Inserta un nuevo usuario en la base de datos
	 * @method insertUser
	 *
	 * @param {*} uObj
	 * @returns
	 * @memberof Userdbr
	 */
	insertUser(uObj) {
		const sql = `
			INSERT INTO ${this.userTable}
			(userid, firstName, lastName, password, email, role, active, google)
			VALUES
			(?, ?, ?, ?, ?, ?, ?, ?)
		`;
		const values = [
			uObj.userId,
			uObj.firstName,
			uObj.lastName,
			uObj.password,
			uObj.email,
			uObj.role,
			uObj.active,
			uObj.google,
		];

		return this.dao.run(sql, values);
	}

	/**
	 * Devuelve un usuario identificado por el userId
	 * @method getUser
	 *
	 * @param {string} userid
	 * @returns
	 * @memberof Userdbr
	 */
	getUser(userid) {
		const sql = `
			SELECT userid, firstName, lastName, email, role, active, google
			FROM ${this.userTable}
			WHERE rtrim(userid) = ?
		`;
		return this.dao.get(sql, [userid]);
	}

	/**
	 * Obtiene una lista de usuarios en un arreglo ordenados por el campo solicitado (sortField)
	 *
	 * @param {string} sortField
	 * @returns
	 * @memberof Userdbr
	 */
	getUsers(sortField) {
		const sql = `
			SELECT userid, firstName, lastName, email, role, active, google
			FROM ${this.userTable}
			ORDER BY ?
		`;
		return this.dao.all(sql, [sortField]);
	}

	/**
	 * Actualiza un usuario, sin incluir el userId ni el password
	 * @method updateUser
	 *
	 * @param {Object} uObj - Objeto con la informacion del usuario
	 * @returns
	 * @memberof Userdbr
	 */
	updateUser(uObj) {
		const sql = `
			UPDATE ${this.userTable}
			SET firstName = ?,
				lastName = ?,
				email = ?,
				role = ?,
				active = ?,
				google = ?
			WHERE userid = ?
		`;
		const values = [
			uObj.firstName,
			uObj.lastName,
			uObj.email,
			uObj.role,
			uObj.active,
			uObj.google,
			uObj.userId,
		];

		return this.dao.run(sql, values);
	}

	/**
	 * Inactiva un usuario dado
	 * @method inactivateUser
	 *
	 * @param {string} userid
	 * @returns
	 * @memberof Userdbr
	 */
	inactivateUser(userid) {
		const sql = `
        UPDATE ${this.userTable} 
          SET active = 0
          WHERE userid = ?
      `;
		return this.dao.run(sql, [userid]);
	}

	/**
	 * Acticaa un usuario dado
	 * @method activateUser
	 *
	 * @param {string} userid
	 * @returns
	 * @memberof Userdbr
	 */
	activateUser(userid) {
		const sql = `
			UPDATE ${this.userTable} 
			SET active = 1
			WHERE userid = ?
		`;
		return this.dao.run(sql, [userid]);
	}

	/**
	 * Cambia el password de un usuario dado
	 * @method changePassword
	 *
	 * @param {string} userid - ID de usuario
	 * @param {string} password - password del usuario
	 * @returns
	 * @memberof Userdbr
	 */
	changePassword(userid, password) {
		if (password == null) {
			let status = {};
			status.type = 0;
			status.msg = "No hay password especificado";
			return status;
		}
		const pw = bcrypt.hashSync(password, 10);
		const sql = `
			UPDATE ${this.userTable} 
			SET password = ?
			WHERE userid = ?
		`;
		return this.dao.run(sql, [pw, userid]);
	}

	/**
	 * Obtiene información para el login del usuario dado
	 *
	 * @param {String} userid
	 * @returns
	 * @memberof Userdbr
	 */
	getLoginInfo(userid) {
		const sql = `
			SELECT userid, password, role, active, google
			FROM ${this.userTable}
			WHERE rtrim(userid) = ?
		`;
		return this.dao.get(sql, [userid]);
	}

	/**
	 * Elimina un usuario. Este método normalmente no se pone a disposición. 
	 * Lo que normalmente se hace es Inactivar un usuario
	 * @method deleteUser
	 *
	 * @param {*} userid
	 * @returns
	 * @memberof Userdbr
	 */
	deleteUser(userid) {
		const sql = `
			DELETE FROM ${this.userTable} WHERE userid = ?
		`;
		return this.dao.run(sql, [userid]);
	}

	/**
	 * Cierra la conexion con la Base de Datos
	 * Este método ha de ser llamado cada vez que se consluye unaa operación sobre la base de datos
	 * @method close
	 *
	 * @returns
	 * @memberof Userdbr
	 */
	close() {
		return this.dao.close();
	}
}

module.exports = Userdbr;
