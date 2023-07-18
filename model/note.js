const { DataTypes } = require("sequelize");
const { sequelize, config } = require("../database");

// After booking a praty successfully, user can make a note regarding package, 
// Themes, pizzas, drinks, tablecloth color, and other requirements.
const Note = sequelize.define(
  "note",
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
  },
  config
);

module.exports = Note;
