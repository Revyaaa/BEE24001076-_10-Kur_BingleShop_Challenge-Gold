'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    total_price: {type:DataTypes.DECIMAL, allowNull: false},
    quantity: {type:DataTypes.INTEGER, allowNull: false},
    status: {type: DataTypes.ENUM('pending', 'finished'), allowNull: true, defaultValue:'pending'},
    user_id:{type:DataTypes.INTEGER}
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};