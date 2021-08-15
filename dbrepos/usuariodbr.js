const bcrypt = require('bcrypt');

class Userdbr {
    constructor(dao) {
        this.dao = dao
        this.userTable = process.env.USERTABLE 
    }

    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS ${this.userTable} (
        userid TEXT(20),
        firstName TEXT(30),
        lastName TEXT(30),
        password TEXT(30),
        email TEXT(30),
        role TEXT(30),
        active INTEGER(1),
        google INTEGER(1)
        `
      return this.dao.run(sql)
    }

    dropTable() {
      const sql = `
        DROP TABLE IF EXISTS ${this.userTable}
      `
      return this.dao.run(sql)
    }

    insertUser(uObj) {
      const sql = `
        INSERT INTO ${this.userTable}
          (userid, firstName, lastName, password, email, role, active, google)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?)
      `
      const values = [uObj.userId, uObj.firstName, uObj.lastName, uObj.password, 
                      uObj.email, uObj.role, uObj.active, uObj.google]

     return this.dao.run(sql, values)
    }

    getUser(userid) {
      const sql = `
        SELECT userid, firstName, lastName, password, email, role, active, google
        FROM ${this.userTable}
        WHERE rtrim(userid) = ?
      `
      return this.dao.get(sql, [userid])
    }

    getUsers(sortField) {
      const sql = `
        SELECT userid, firstName, lastName, password, email, role, active, google
        FROM ${this.userTable}
        ORDER BY ?
      `
      return this.dao.all(sql, [sortField])
    }

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
      `
      const values = [uObj.firstName, uObj.lastName, uObj.email, uObj.role, uObj.active, uObj.google, uObj.userId]

      return this.dao.run(sql, values)
    }

    inactivateUser(userid) {
      const sql = `
        UPDATE ${this.userTable} 
          SET active = 0
          WHERE userid = ?
      `
      return this.dao.run(sql, [userid])
    }

    activateUser(userid) {
      const sql = `
        UPDATE ${this.userTable} 
          SET active = 1
          WHERE userid = ?
      `
      return this.dao.run(sql, [userid])
    }

    changePassword(userid, password) {
      const pw = bcrypt.hashSync(password, 10) 
      const sql = `
        UPDATE ${this.userTable} 
          SET password = ?
          WHERE userid = ?
      `
      return this.dao.run(sql, [pw, userid])
    }

    deleteUser(userid) {
      const sql = `
        DELETE FROM ${this.userTable} WHERE userid = ?
      `
      return this.dao.run(sql, [userid])
    }

    close() {
      return this.dao.close()
    }
}

module.exports = Userdbr