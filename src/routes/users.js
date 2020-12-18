const route = require('express').Router()
const uploadHelper = require('../helpers/upload')

const userController = require('../controllers/users')

// route.get('/', userController.showUsers)
route.get('/', userController.showUser)
route.get('/news', userController.showNews)
route.patch('/', uploadHelper, userController.updateUser)
route.patch('/changepassword', userController.changePassword)
route.delete('/', userController.deleteUser)

module.exports = route
