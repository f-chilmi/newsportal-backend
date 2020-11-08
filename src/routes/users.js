const route = require('express').Router()
const uploadHelper = require('../helpers/upload')

const userController = require('../controllers/users')

// route.get('/', userController.showUsers)
route.get('/', userController.showUser)
route.patch('/', uploadHelper, userController.updateUser)
route.delete('/', userController.deleteUser)

module.exports = route
