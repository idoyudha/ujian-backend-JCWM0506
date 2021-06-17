const { db, dbQuery } = require('../config')

module.exports = {
    getAllMovie: async (request, response, next) => {
        try {
            console.log("Go to all movie")
            let queryMovies = `SELECT name, release_date, release_month, release_year, duration_min, genre, description, movie_status.status as status, location, time FROM movies JOIN movie_status ON movies.id = movie_status.id JOIN schedules ON movies.id = schedules.movie_id JOIN show_times ON schedules.time_id = show_times.id JOIN locations ON schedules.location_id = locations.id`
            let DataMovies = await dbQuery(queryMovies)
            response.status(200).send(DataMovies)
        } 
        catch (error) {
            next(error)
        }
    },

    getMovieByParameter: async (request, response, next) => {
        try {
            console.log("Go to", request.query)
            let query = []
            for (property in request.query) {
                if (property == 'status') {
                    query.push(`movie_status.${property} = ${db.escape(request.query[property].replace('%', ' '))}`)
                }
                else {
                    query.push(`${property} = ${db.escape(request.query[property].replace('%', ' '))}`)
                }
            }
            // console.log(query)
            let str = query.join(' AND ')
            // console.log(str)
            let queryMovies = `SELECT name, release_date, release_month, release_year, duration_min, genre, description, movie_status.status as status, location, time FROM movies JOIN movie_status ON movies.id = movie_status.id JOIN schedules ON movies.id = schedules.movie_id JOIN show_times ON schedules.time_id = show_times.id JOIN locations ON schedules.location_id = locations.id WHERE ${str}`
            let DataMovies = await dbQuery(queryMovies)
            response.status(200).send(DataMovies)
            // response.status(200).send("getMovieByParameter")
        } 
        catch (error) {
            next(error)
        }
    },

    addMovie: async (request, response, next) => {
        try {
            let auth = request.user
            // console.log(auth)
            console.log("Go to add movie", auth)
            if (auth.role == 1) {
                console.log('Admin')
                let queryInsert = `INSERT INTO movies (name, release_date, release_month, release_year, duration_min, genre, description) VALUES (${db.escape(request.body.name)}, ${db.escape(request.body.release_date)}, ${db.escape(request.body.release_month)}, ${db.escape(request.body.release_year)}, ${db.escape(request.body.duration_min)}, ${db.escape(request.body.genre)}, ${db.escape(request.body.description)})`
                let dataInsert = await dbQuery(queryInsert)

                let queryMovies = `SELECT id, name, genre, release_date, release_month, release_year, duration_min, description FROM movies WHERE id = ${dataInsert.insertId}`
                let DataMovies = await dbQuery(queryMovies)
                response.status(200).send(DataMovies)
            }
            else {
                response.status(200).send("Permission denied, just Admin!")
            }
        } 
        catch (error) {
            next(error)
        }
    },

    replaceMovieStatus: async (request, response, next) => {
        try {
            let auth = request.user
            // console.log("Go to movie status", request.params.id)
            let id = request.params.id.slice(3)

            if (auth.role == 1) {
                console.log('Admin')
                let queryUpdate = `UPDATE movies SET status = ${request.body.status} WHERE id = ${id}`
                await dbQuery(queryUpdate)

                response.status(200).send({id : id, message: 'status has been changed'})
            }
            else {
                response.status(200).send("Permission denied, just Admin!")
            }
        } 
        catch (error) {
            next(error)
        }
    },

    addMovieSchedule: async (request, response, next) => {
        try {
            let auth = request.user
            let id = request.params.id.slice(3)
            console.log("Go to schedule", id)
            if (auth.role == 1) {
                console.log('Admin')
                let queryInsert = `INSERT INTO schedules (movie_id, location_id, time_id) VALUES (${id}, ${request.body.location_id}, ${request.body.time_id}) `
                await dbQuery(queryInsert)

                response.status(200).send({id : id, message: 'schedule has been added'})
            }
            else {
                response.status(200).send("Permission denied, just Admin!")
            }
        } 
        catch (error) {
            next(error)
        }
    },
}