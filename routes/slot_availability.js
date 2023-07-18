var express = require("express");
var router = express.Router();

const Order = require("../model/order");
const { useAllTimeSlots } = require("../model/time_slot");

/* Get time slot availability. */
router.get("/", async function (req, res, next) {
  // Parse date from query string
  const partyDate = new Date(req.query.partyDate).toISOString();

  // Find all existing orders on the party date
  // Orders: Time slots reserved by users
  // Boolean is_user_order: true -- booked by user, false -- blocked by Admin
  const orders = await Order.findAll({
    where: { order_date: partyDate },
  });

  res.json(
    useAllTimeSlots().map((slot) => {
      // Try to find corresponding order
      // Possibly got undefined
      const order = orders.find(
        (order) => order["time_slot_id"] === slot["id"]
      );

      // If the time slot has been booked/blocked already, then order is defined, and available is false.
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
