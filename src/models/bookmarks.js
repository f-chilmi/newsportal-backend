'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookmarks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bookmarks.belongsTo(models.User, { foreignKey: 'user_id' })
      Bookmarks.belongsTo(models.News, { foreignKey: 'news_id' })
      Bookmarks.belongsTo(models.Category, { foreignKey: 'category_id' })
    }
  };
  Bookmarks.init({
    user_id: DataTypes.INTEGER,
    news_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Bookmarks',
  });
  return Bookmarks;
};