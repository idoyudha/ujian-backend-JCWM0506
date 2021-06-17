const { db, dbQuery, createToken } = require('../config')
const Crypto = require('crypto')

module.exports = {
    register: async (request, response, next) => {
        try {
            console.log(request)
            let validUsername = request.body.username.length > 5
            let validEmail = request.body.email.includes("@")
            let rePassword = new RegExp("^(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})")
            let validPassword = rePassword.test(request.body.password)
            // let validPassword2 = request.body.password.match(/^(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/)
            console.log("Go to register", validUsername, validEmail, validPassword)
            if (validUsername && validEmail && validPassword) {
                let password = db.escape(Crypto.createHmac("sha256", "token$$$").update(request.body.password).digest("hex"))
                let queryRegister = `INSERT INTO users (uid, username, email, password, role, status) VALUES (${Date.now()}, ${db.escape(request.body.username)}, ${db.escape(request.body.email)}, ${password}, 2, 1)`
                let dataUser = await dbQuery(queryRegister)
                let getUser = await dbQuery(`SELECT * FROM users WHERE id = ${dataUser.insertId}`)
                let {id, uid, username, email, role, status} = getUser[0]
                let token = createToken({id, uid, username, email, role, status})
                response.status(200).send({id, uid, username, email, token})
            }
            else {
                response.status(400).send('Parameter not complete or not valid!')
            }
            response.status(400).send('Trial Error!')
        } 
        catch (error) {
            next(error)
        }
    },

    login: async (request, response, next) => {
        try {
            // console.log("Go to Login")
            let password = Crypto.createHmac("sha256", "token$$$").update(request.body.password).digest("hex")
            let queryLogin = `SELECT * FROM users WHERE username = ${db.escape(request.body.username)} AND password = ${db.escape(password)}`
            let getUser = await dbQuery(queryLogin)
            console.log(getUser.status)

            if (getUser.status == 3) {
                response.status(400).send('Your account is not active!')
            }
            
            else {
                if (getUser.length > 0) {
                    let {id, uid, username, email, status, role} = getUser[0]
                    let token = createToken({id, uid, username, email, status, role})
                    response.status(200).send({id, uid, username, email, status, role, token})
                }
                else {
                    response.status(400).send('Account with that password not found!')
                }
            }

        } 
        catch (error) {
            next(error)
        }
    },

    deactivate: async (request, response, next) => {
        try {
            let auth = request.user.id
            // console.log("Go to deactivate", auth)
            if (auth) {
                let queryDeactivate = `UPDATE users SET status = 2 WHERE id = ${auth} `
                await dbQuery(queryDeactivate)
                
                let querySelect = `SELECT uid, status.status FROM users JOIN status ON status.id = users.status WHERE users.id = ${auth}`
                let responseData = await dbQuery(querySelect)
                response.status(400).send(responseData)
            }
        } 
        catch (error) {
            next(error)
        }
    },

    activate: async (request, response, next) => {
        try {
            console.log("Go to activate")
            let auth = request.user.id

            let queryActivate = `UPDATE users SET status = 1 WHERE id = ${auth} `
            await dbQuery(queryActivate)

            let querySelect = `SELECT uid, status.status FROM users JOIN status ON status.id = users.status WHERE users.id = ${auth}`
            let responseData = await dbQuery(querySelect)
            response.status(400).send(responseData)
        } 
        catch (error) {
            next(error)
        }
    },

    close: async (request, response, next) => {
        try {
            console.log("Go to activate")
            let auth = request.user.id

            let queryClose = `UPDATE users SET status = 3 WHERE id = ${auth} `
            await dbQuery(queryClose)

            let querySelect = `SELECT uid, status.status FROM users JOIN status ON status.id = users.status WHERE users.id = ${auth}`
            let responseData = await dbQuery(querySelect)
            response.status(400).send(responseData)
        } 
        catch (error) {
            next(error)
        }
    },

}