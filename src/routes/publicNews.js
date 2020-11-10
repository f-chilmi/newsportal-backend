const route = require('express').Router()

const newsController = require('../controllers/news')

route.get('/', newsController.showNews)
route.get('/:id', newsController.showNewsById)

module.exports = route
