const { DataTypes } = require("sequelize");
const { sequelize, config } = require("../database");

// After booking a praty successfully, user can make a note regarding package, 
// Themes, pizzas, drinks, tablecloth color, and other requirements.
const OrderInfo = sequelize.define(
  "order_info",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    party_theme: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pizzas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    drinks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tablecloth_color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    additional_request: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  config
);

module.exports = OrderInfo;
