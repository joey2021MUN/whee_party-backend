const { DataTypes } = require("sequelize");
const { sequelize, config } = require("../database");

const PartySchedule = sequelize.define(
  "party_schedules",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    party_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    time_slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  config
);

module.exports = PartySchedule;
