var express = require('express');
var router = express.Router();

const Order = require('../model/order');

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Create a new order
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             date:
 *               type: string
 *               description: The date of the party
 *               example: "2023-05-01"
 *             time_slot:
 *               type: string
 *               description: The time slot of the party
 *               example: "10 am - 12 pm"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response
 *       '401':
 *         description: Unauthorized
 */
router.post('/', async function(req, res, next) {
    const date = new Date(req.body.date);
    const timeSlotId = req.body.time_slot_id;

    try {
        await Order.create({
            order_date: date,
            time_slot_id: timeSlotId,
        });
        res.json({success: true, message: "Booking success!"});
    } catch (error) {
        res.json({success: false, message: "Not Available!"});
    }
});

module.exports = router;
