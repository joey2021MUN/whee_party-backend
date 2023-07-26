const { DataTypes } = require("sequelize");
const { sequelize, config } = require("../database");

// Bond with order
const Payment = sequelize.define(
  "payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  config
);

module.exports = Payment;
