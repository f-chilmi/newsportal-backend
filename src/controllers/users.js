const {User} = require('../models')
const bcrypt = require('bcryptjs')

module.exports = {
  createUser: async(req, res) => {
    let {name, birth, email, password} = req.body
    password = await bcrypt.hash(password, await bcrypt.genSalt())
    const data = {name, birth, email, password}
    const results = await User.create(data)
    res.send({
      success: true,
      message: 'User created successfully',
      results
    })
  }
}
