var express = require('express');
var router = express.Router();

const { PartySchedule, Order } = require('../database');

/**
 {
    date: '2023-11-01',
    slots: {
        1 "10-12": true,
        2 "11-13": false,
        3 "12.5-14.5": true,
        4 "13.5-15.5": true,
        5 "15-17"
        6 "16-18"
        7 "17.5-19.5"
        8 "18.5-20.5"
    }
 }
 */

/* GET users listing. */
router.get('/', async function(req, res, next) {
  //res.send('respond with a resource');
  const partyDate = new Date(req.query.partyDate).toISOString();

  const schedules = await PartySchedule.findAll({
    where: {
      party_date: partyDate,
    },
  });

  const orders = await Order.findAll({
    where: {
      order_date: partyDate,
    },
  });
  
  // All reserved slots
  slot_ids = schedules.map(s => Number.parseInt(s['time_slot_id']));
  order_ids = orders.map(o => Number.parseInt(o['order_time_slot']));

  const result = Array(8).fill(true);
  //不太明白
  for (const slot_id of new Set([...slot_ids, ...order_ids])) {
      result[slot_id - 1] = false;
  }

  const response = {
      "10-12"    : result[0],
      "11-13"    : result[1],
      "12.5-14.5": result[2],
      "13.5-15.5": result[3],
      "15-17"    : result[4],
      "16-18"    : result[5],
      "17.5-19.5": result[6],
      "18.5-20.5": result[7],
  };
  res.json(response);
});

module.exports = router;
