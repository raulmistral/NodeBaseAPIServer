/** 
 * dao.js
 * 
 * MODELO DEL ACCESO A LA BASE DE DATOS
 * 
 * Contiene la Clase que define los accesos a la base de datps, permitiendo que el resto
 * del servicio sea agnóstico a la base de datos y su api.
 * 
 * La clase define los métodos que serán llamados desde los distintos Data Access Objets y 
 * ella los traduce a las llamadas a las api de la base de datos correspondiente
 * 
 * En este caso particular, DAO está definido para SQLite
 */

const sqlite3 = require('sqlite3')

/**
 * Clase que sera la base para definir los DAO de los objetos de negocio (ej.: usuarios)
 *
 * @class AppDAO
 */
class AppDAO {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.log('No se conectó a la Base de Datos', err)
      }
    })
  }

  /**
   * Permite ejecutar instruccciones SQL del tipo CREATE, INSERT, UPDATE, DELETE, etc. Ver api
   *
   * @param {string} sql - instruccion SQL a ser ejecutada
   * @param {string} [params=[]] -  parametros a ser inyectados en la isntrucción SQL
   * @returns {object} status (type, msg, changes)
   * @memberof AppDAO
   */
  run(sql, params = []) {
    let status = {}
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          status.type = 0
          status.msg = err.message
          reject(status)
        } else {
          status.type = 1
          status.msg = 'Ok'
          // this.changes es un numero entero que indica la cantidad de cambios realizados
          status.changes = this.changes
          resolve(status)
        }
      })
    })
  }

  /**
   * @method get
   * Obtiene un registro de la base de datos. Devuelve una Promesa
   *
   * @param {string} sql - instruccion SQL a ser ejecutada
   * @param {string} [params=[]] -  parametros a ser inyectados en la isntrucción SQL
   * @returns {object} status (status.type, status.msg, result - objeto con el registro solicitado)
   * @memberof AppDAO
   */
  get(sql, params = []) {
    let retObj = {}
    let status = {}

    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          // Toma esta via sólo si hubo error a nivel de base de datos
          status.type = 0
          status.msg = err.message
          retObj.status = status
          retObj.result = {}
          reject(retObj)
        } else {
          // Si no consigue el registro solicitado, "row" es nulo, 
          // de lo contrario "row" contiene el registro
          status.type = 1
          status.msg = 'Ok'
          retObj.status = status
          retObj.result = row
          resolve(retObj)
        }
      })
    })
  }

  /**
   * @method all
   * Devuelve un grupo de registros en un arreglo según alguna condicion dada por 
   * la combinación sql / params
   *
   * @param {*} sql
   * @param {*} [params=[]]
   * @returns {object} status (status.type, status.msg, result - arreglo de objetos de usuarios solicitados)
   * @memberof AppDAO
   */
  all(sql, params = []) {
    let retObj = {}
    let status = {}

    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          status.type = 0
          status.msg = err.message
          retObj.status = status
          retObj.result = {}
          reject(retObj)
        } else {
          // Si no consigue registros, "rows" es un arreglo vacio, 
          // de lo contrario "rows" es un arreglo donde cada elemento 
          // del arreglo es un registro como objeto JSON
          status.type = 1
          status.msg = 'Ok'
          retObj.status = status
          retObj.result = rows
          resolve(retObj)
        }
      })
    })
  }
  
  /**
   * @method close
   *
   * @returns@returns {object} status (type, msg)
   * @memberof AppDAO
   */
  close() {

    let retObj = {}
    let status = {}

    return new Promise((resolve, reject) => {
      let status = {}
      this.db.close((err) => {
        if (err) {
          status.type = 0
          status.msg = err.message
          reject(status)
        } else {
          status.type = 1
          status.msg = 'Ok'
          resolve(status)
        }
      });
    })
  }
}

module.exports = AppDAO