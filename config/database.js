const mysql = require('mysql')
const util = require('util')

const db = mysql.createPool({
    host: 'localhost',
    user: 'ido-p',
    password: 'ido123',
    database: 'backend_2021',
    multipleStatements: true
})

const dbQuery = util.promisify(db.query).bind(db)

module.exports = { db, dbQuery}