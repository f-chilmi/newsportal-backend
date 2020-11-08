const route = require('express').Router()

const bookmarksController = require('../controllers/bookmarks')

route.get('/', bookmarksController.getData)
route.post('/', bookmarksController.createData)
route.delete('/:id', bookmarksController.deleteData)

module.exports = route
