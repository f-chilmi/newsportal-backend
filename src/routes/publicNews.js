const route = require('express').Router()

const newsController = require('../controllers/news')

route.get('/', newsController.showNews)

module.exports = route
