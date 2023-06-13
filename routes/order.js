var express = require('express');
var router = express.Router();

const { Order } = require('../database');

const TimeslotMap = [
    "10-12",
    "11-13",
    "12.5-14.5",
    "13.5-15.5",
    "15-17",
    "16-18",
    "17.5-19.5",
    "18.5-20.5",
  ];
  
/* POST order to database. */
router.post('/', async function(req, res, next) {
    const date = new Date(req.body.date);
    const timeslot = req.body.time_slot;
    const timeSlotId = TimeslotMap.indexOf(timeslot) + 1;

    try {
        await Order.create({
            order_date: date,
            order_time_slot: timeSlotId,
        });
        res.json({success: true, message: "Order success!"});
    } catch (error) {
        res.json({success: false, message: "Duplicated order!"});
    }
});

module.exports = router;
