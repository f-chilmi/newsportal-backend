const route = require('express').Router()
const uploadHelper = require('../helpers/upload')

const newsController = require('../controllers/news')

route.post('/', uploadHelper, newsController.createNews)
// route.get('/', newsController.showNews)
route.patch('/:id', uploadHelper, newsController.updateNews)
route.delete('/:id', newsController.deleteNews)

module.exports = route
