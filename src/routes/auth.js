const route = require('express').Router()

const userController = require('../controllers/users')

route.post('/register', userController.registerUser)
route.post('/login', userController.loginUser)

module.exports = route
