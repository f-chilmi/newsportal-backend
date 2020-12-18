const { User, News, Category } = require('../models')
const bcrypt = require('bcryptjs')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const responseStandard = require('../helpers/response')

module.exports = {
  registerUser: async (req, res) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().lowercase().email().required(),
      password: Joi.string().required()
    })
    const { value, error } = schema.validate(req.body)
    if (error) {
      return responseStandard(res, 'Email or Password Invalid', {}, 400, false)
    }
    const password = await bcrypt.hash(value.password, await bcrypt.genSalt())
    const resultEmail = await User.findAll({ where: { email: value.email } })
    console.log(resultEmail.length)
    if (resultEmail.length) {
      responseStandard(res, 'Email registered', {}, 400, false)
    } else {
      const results = await User.create({ name: value.name, email: value.email, password: password })
      responseStandard(res, 'User created successfully', { results }, 200, true)
    }
  },
  loginUser: async (req, res) => {
    const schema = Joi.object({
      email: Joi.string().lowercase().email().required(),
      password: Joi.string().required()
    })
    const { value, error } = schema.validate(req.body)
    if (error) {
      return responseStandard(res, 'Email or Password Invalid', {}, 400, false)
    }
    const result = await User.findAll({
      where: {
        email: value.email
      }
    })
    if (result.length) {
      const passwordDB = result[0].dataValues.password
      const comparePassword = bcrypt.compareSync(value.password, passwordDB)
      if (comparePassword) {
        const detailUser = {
          id: result[0].id,
          username: result[0].username,
          email: result[0].email
        }
        const token = jwt.sign({ detailUser }, process.env.APP_KEY, { expiresIn: '365 days' })
        return responseStandard(res, 'Login successfully!', { token }, 200, true)
      } else {
        return responseStandard(res, 'Wrong email or password', {}, 400, false)
      }
    } else {
      return responseStandard(res, 'Wrong email or password', {}, 400, false)
    }
  },
  forgotPassword: async (req, res) => {
    const { email, newPassword, confirmNewPassword } = req.body
    if (newPassword === confirmNewPassword) {
      const dbHasEmail = await User.findAll({ where: { email: email } })
      if (dbHasEmail.length) {
        // const oldPassword = dbHasEmail[0].dataValues.password
        const password = await bcrypt.hash(newPassword, await bcrypt.genSalt())
        dbHasEmail[0].password = password
        dbHasEmail[0].save()
        responseStandard(res, 'Password changed', { ...dbHasEmail[0].dataValues, password }, 200, true)
      } else {
        responseStandard(res, 'your email is not registered', {}, 400, false)
      }
    } else {
      responseStandard(res, 'password must be the same', {}, 400, false)
    }
  },
  changePassword: async (req, res) => {
    const { id } = req.user.detailUser
    const { oldPassword, newPassword, confirmNewPassword } = req.body
    if (newPassword === confirmNewPassword) {
      const dbHasId = await User.findByPk(id)
      const passwordDB = dbHasId.dataValues.password
      const comparePassword = bcrypt.compareSync(oldPassword, passwordDB)
      if (comparePassword) {
        const newpassword = await bcrypt.hash(newPassword, await bcrypt.genSalt())
        dbHasId.password = newpassword
        dbHasId.save()
        responseStandard(res, 'Password changed', { ...dbHasId.dataValues, newpassword }, 200, true)
      } else {
        responseStandard(res, 'Type your old password correctly', {}, 400, false)
      }
    } else {
      responseStandard(res, 'password must be the same', {}, 400, false)
    }
  },
  showUsers: async (req, res) => {
    console.log(req.user.detailUser.id)
    const result = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    })
    responseStandard(res, 'List user registered:', { result }, 200, true)
  },
  showUser: async (req, res) => {
    const { id } = req.user.detailUser
    const result = await User.findByPk(id)
    responseStandard(res, 'User detail', { result }, 200, true)
  },
  showNews: async (req, res) => {
    const { id } = req.user.detailUser
    const result = await News.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ['birth', 'email', 'password', 'createdAt', 'updatedAt'] }
        },
        {
          model: Category,
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }],
      where: { user_id: id }
    })
    responseStandard(res, 'User detail', { result }, 200, true)
  },
  updateUser: async (req, res) => {
    const { id } = req.user.detailUser
    const { name, birth, email } = req.body
    const result = await User.findByPk(id)
    if (result) {
      const data = { name, birth, email }
      if (req.file) {
        const image = `uploads/${req.file.filename}`
        result.update({ ...data, image })
        responseStandard(res, `User ${id} updated`, { data: { ...data, image } }, 200, true)
      } else {
        result.update(data)
        responseStandard(res, `User ${id} updated`, { data }, 200, true)
      }
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.user.detailUser
    const result = await User.findByPk(id)
    const result1 = await result.destroy()
    responseStandard(res, 'User data deleted', {}, 200, true)
  }
}
