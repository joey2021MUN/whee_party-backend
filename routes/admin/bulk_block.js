
var express = require('express');
var router = express.Router();

const { useAllTimeSlots } = require('../../model/time_slot');
const Order = require('../../model/order');

/**
 * @swagger
 * /admin/bulk-block:
 *   post:
 *     summary: Block multiple timeslots
 *     requestBody:
 *           required: true
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   start_date:
 *                     type: string
 *                     example: "2023-09-01"
 *                   end_date:
 *                     type: string
 *                     example: "2023-10-05"
 *                   reason:
 *                     type: string
 *                     example: "Maintenance"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response
 *       '401':
 *         description: Unauthorized
 */

// Admin can block multiple timeslots at once, minimum 2 days.
router.post('/bulk-block', async function(req, res, next) {
    const startDate = new Date(Date.parse(req.body.start_date));
    const endDate = new Date(Date.parse(req.body.end_date));

    if (isNaN(startDate) || isNaN(endDate)) {
        return res.json({ success: false, message: "Invalid date!" });
    }

    if (startDate > endDate) {
        return res.json({ success: false, message: "Start date must be before end date!" });
    }

    // Iterate through each day
    var orders = [];
    for (
        var date = startDate; 
        date <= endDate; 
        date = new Date(date.getTime() + (24 * 60 * 60 * 1000))
    ) {
        // Iterate through each time slot
        for (const slot of useAllTimeSlots()) {
            orders.push({
                order_date: date,
                time_slot_id: slot['id'],
                user_id: 1,
                is_user_order: false,
                reason: req.body.reason,
            });
        }
    }

    try {
        await Order.bulkCreate(orders);
        res.json({success: true, message: "Bulk block success!"});
    }
    catch (e) {
        res.json({success: false, message: "Bulk block failed: " + e });
    }
});

module.exports = router;
