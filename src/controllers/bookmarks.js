const { Bookmarks, User, News, Category } = require('../models')
const Joi = require('joi')
const responseStandard = require('../helpers/response')

module.exports = {
  getData: async (req, res) => {
    console.log(req.user.detailUser.id)
    const { id } = req.user.detailUser
    const result1 = await Bookmarks.findAll({
      include: {
        model: User,
        attributes: {
          exclude: ['birth', 'email', 'password', 'createdAt', 'updatedAt']
        }
      }
    })
    const result2 = await Bookmarks.findAll({
      include: { model: News }
    })
    const result3 = await Bookmarks.findAll({
      include: {
        model: Category,
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      }
    })
    const result = { result1, ...result2, ...result3 }
    responseStandard(res, 'Your bookmarks', { result }, 200, true)
  },
  createData: async(req, res) => {
    const { id } = req.user.detailUser
    const schema = Joi.object({
      category_id: Joi.string().required(),
      news_id: Joi.string().required()
    })
    const { value, error } = schema.validate(req.body)
    if (error) {
      return responseStandard(res, {error: error.message}, {}, 400, false)
    }
    const data = {
      user_id: id,
      category_id: value.category_id,
      news_id: value.news_id
    }
    await Bookmarks.create(data)
    responseStandard(res, 'Success added news to bookmark', { data }, 200, true)
  },
  deleteData: async (req, res) => {
    const { id } = req.params
    const result = await Bookmarks.findByPk(id)
    await result.destroy()
    responseStandard(res, `Bookmark ${id} deleted`, {}, 200, true)
  }
}
