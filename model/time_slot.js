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

  
// Read all time slots at server startup
// Because time slots are not changed frequently
var allTimeSlots = [];

async function tryInitializeTimeSlots() {
  if (allTimeSlots.length === 0) {
    allTimeSlots = await TimeSlot.findAll();
  }
}

function useAllTimeSlots() {
  return allTimeSlots;
}

// Ensure allTimeSlots is initialized
tryInitializeTimeSlots().then(() => {
  console.log("Time slots initialized: " + allTimeSlots.length);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
  
module.exports = { TimeSlot, useAllTimeSlots };
