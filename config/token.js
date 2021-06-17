const jwt = require('jsonwebtoken')

module.exports = {
    createToken: (payload) => {
        return jwt.sign(payload, "backend-exam")
    },

    readToken: (request, response, next) => {
        console.log('Request read token', request.token)
        jwt.verify(request.token, "backend-exam", (error, decoded) => {
            if (error) {
                return response.status(401).send('Token Error: user not authorized')
            }
            request.user = decoded 
            next()
        })
    }
}
   