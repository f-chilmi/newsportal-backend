const route = require('express').Router()

const userController = require('../controllers/users')

route.post('/', userController.createUser)

module.exports = route
