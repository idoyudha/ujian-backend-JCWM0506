const router = require('express').Router()
const { movieController } = require('../controller')
const { readToken } = require('../config')

router.get('/get/all', movieController.getAllMovie)
router.get('/get', movieController.getMovieByParameter)
// Just can be accessed by admin
router.post('/add', readToken, movieController.addMovie)
router.patch('/edit/:id', readToken, movieController.replaceMovieStatus)
router.patch('/set/:id', readToken, movieController.addMovieSchedule)


module.exports = router