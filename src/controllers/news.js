const { News, Category, User } = require('../models')
const Joi = require('joi')
const responseStandard = require('../helpers/response')
const { pagination } = require('../helpers/pagination')

module.exports = {
  createNews: async(req, res) => {
    const { id } = req.user.detailUser
    const schema = Joi.object({
      category_id: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
    })
    const { value, error } = schema.validate(req.body)
    if (error) {
      return responseStandard(res, {error: error.message}, {}, 400, false)
    }
    const image = `uploads/${req.file.filename}`
    const data = {
      user_id: id,
      category_id: value.category_id,
      title: value.title,
      description: value.description,
      image: image
    }
    const results = await News.create(data)
    responseStandard(res, 'News uploaded', { data }, 200, true)
  },
  showNews: async(req, res) => {
    // const { page = 1, limit = 10, search = '', sort = '' } = req.query
    // const offset = (page - 1) * limit
    // if (typeof search === 'object') {
    //   search = Object.values(search)[0]
    // }
    // if (typeof sort === 'object') {
    //   sort = Object.values(sort)[0]
    // }
    const result0 = await News.findAll({
      include: {
        model: User,
        attributes: {
          exclude: ['birth', 'email', 'password', 'createdAt', 'updatedAt']
        }
      }
    })
    const result1 = await News.findAll({
      include: {
        model: Category,
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    })
    const result = { category: result1[0].Category, ...result0 }
    responseStandard(res, 'List of news', { result }, 200, true)
  },
  updateNews: async (req, res) => {
    // const userId = req.user.detailUser.id
    const { id } = req.params
    const { category_id, title, description } = req.body
    const result = await News.findByPk(id)
    if (result) {
      const data = { category_id, title, description }
      if (req.file) {
        const image = `uploads/${req.file.filename}`
        result.update({ ...data, image })
        responseStandard(res, `News ${id} updated`, { data: {...data, image} }, 200, true)
      } else {
        result.update(data)
        responseStandard(res, `News ${id} updated`, { data }, 200, true)
      }
    }
  },
  deleteNews: async (req, res) => {
    const { id } = req.params
    const result = await News.findByPk(id)
    const result1 = await result.destroy()
    responseStandard(res, `News ${id} deleted`, {}, 200, true)
  }
}