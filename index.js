const express = require('express')
const app = express()
const PORT = process.env.PORT || 2000
const cors = require('cors')
const bearerToken = require('express-bearer-token')

const { authRouter, movieRouter } = require('./router')
const { db } = require('./config/database')

// apply middleware
app.use(cors())
app.use(bearerToken())
app.use(express.json())
app.use('/user', authRouter)
app.use('/movies', movieRouter)

// main route
const response = (req, res) => res.status(200).send('<h1>REST API JCWM0506</h1>')
app.get('/', response)

db.getConnection(( error, connection ) => {
    if (error) {
        return console.error('error MySQL: ', error.message)
    }
    console.log(`Connecting to MySQL Server : ${connection.threadId}`)
})

// Error handling 
app.use((error, request, response, next) => {
    console.log("Error", error)
    response.status(500).send({status: "Error MySQL!", messages: error})
})


app.listen(PORT, () => {
    console.log(`CONNECTED at http://localhost:${PORT}`)
})