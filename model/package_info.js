const { DataTypes } = require("sequelize");
const { sequelize, config } = require("../database");

const PackageInfo = sequelize.define(
  "package_info",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  config
);

module.exports = PackageInfo;
