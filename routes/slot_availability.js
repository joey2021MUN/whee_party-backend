var express = require("express");
var router = express.Router();

const PartySchedule = require("../model/party_schedule");
const Order = require("../model/order");
const TimeSlot = require("../model/time_slot");
const moment = require("moment/moment");

// Read all time slots at server startup
// Because time slots are not changed frequently
var allTimeSlots = [];

async function tryInitializeTimeSlots() {
  if (allTimeSlots.length === 0) {
    allTimeSlots = await TimeSlot.findAll();
  }
}

// Ensure allTimeSlots is initialized
tryInitializeTimeSlots().catch((err) => {
  console.error(err);
  process.exit(1);
});

// Compare current time with the start time of a time slot
function isMomentBeforeNow(momentString) {
// Get the current date
  var currentDate = moment();

  // Get the current year, month, and day
  var currentYear = currentDate.format('YYYY');
  var currentMonth = currentDate.format('MM');
  var currentDay = currentDate.format('DD');

  // Create a moment object with the provided time (e.g., 12:00)
  var parsedMoment = moment(momentString, 'HH:mm');

  // Set the year, month, and day of the parsed moment object
  parsedMoment.set('year', currentYear);
  parsedMoment.set('month', currentMonth - 1); // Months in Moment.js are zero-based
  parsedMoment.set('date', currentDay);

  return parsedMoment.unix() < moment().unix();
}

/* GET users listing. */
router.get("/", async function (req, res, next) {
  // Parse date from query string
  const partyDate = new Date(req.query.partyDate).toISOString();

  // Find all schedules and orders on the party date
  // Schedules: 游乐场官方所定的不可用时间段
  // Orders: 用户预定的时间段
  // 新订单的时间段不能与已有订单和不可用时间段重叠
  const schedules = await PartySchedule.findAll({
    where: { party_date: partyDate },
  });
  const orders = await Order.findAll({
    where: { order_date: partyDate },
  });

  // All reserved slots
  const designatedUnavailableSlotIds = schedules.map((s) =>
    Number.parseInt(s["time_slot_id"])
  );
  const userOrderedSlotIds = orders.map((o) =>
    Number.parseInt(o["time_slot_id"])
  );

  // Combine two id arrays and remove duplicates
  const unavailableSlotIds = new Set([
    ...designatedUnavailableSlotIds,
    ...userOrderedSlotIds,
  ]);

  res.json(
    allTimeSlots.map((slot) => {
      return {
        id: slot["id"],
        start_time: slot["start_time"],
        end_time: slot["end_time"],
        available: !isMomentBeforeNow(slot["start_time"]) && !unavailableSlotIds.has(slot["id"]),
      };
    })
  );
});

module.exports = router;
