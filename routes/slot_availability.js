var express = require("express");
var router = express.Router();

const Order = require("../model/order");
const { useAllTimeSlots } = require("../model/time_slot");

/* GET time slot availability. */
router.get("/", async function (req, res, next) {
  // Parse date from query string
  const partyDate = new Date(req.query.partyDate).toISOString();

  // Find all schedules and orders on the party date
  // Orders: Time slots reserved by users
  // New order time slot must not be overlapped with blocked time slots and reserved time slots
  const orders = await Order.findAll({
    where: { order_date: partyDate },
  });

  res.json(
    useAllTimeSlots().map((slot) => {
      // Try find corresponding order
      // Possibly got undefined
      const order = orders.find(
        (order) => order["time_slot_id"] === slot["id"]
      );

      // If the time slot is before current time, or it has been booked/blocked already, it is unavailable
      return {
        id: slot["id"],
        start_time: slot["start_time"],
        end_time: slot["end_time"],
        available: order === undefined,
        is_user_order: order ? order["is_user_order"] : false,
        reason: order ? order["reason"] : "",
      };
    })
  );
});

module.exports = router;
