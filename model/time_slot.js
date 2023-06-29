const { DataTypes } = require("sequelize");
const { sequelize, config } = require("../database");

const TimeSlot = sequelize.define(
    "time_slot",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    config
  );
  
  module.exports = TimeSlot;
  