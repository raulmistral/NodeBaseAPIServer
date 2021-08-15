const sqlite3 = require('sqlite3')

class AppDAO {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.log('No se conectó a la Base de Datos', err)
      } 
      //else {
      //  console.log('Conectado a la base de datos')
      //}
    })
  }

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