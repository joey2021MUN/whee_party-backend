var express = require('express');
var router = express.Router();

const Order = require('../model/order');
const User = require('../model/user');

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Create a new order
 *     requestBody:
 *           required: true
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     description: The date of the party
 *                     example: "2023-08-01"
 *                   time_slot_id:
 *                     type: integer
 *                     description: The time slot of the party
 *                     example: 1
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

    const userEmail = req.legit['email'];
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
        return res.json({ success: false, message: "User not found!" });
    }

    try {
        await Order.create({
            order_date: date,
            time_slot_id: timeSlotId,
            user_id: user['id'],
            is_user_order: true,
            reason: "",
        });
        res.json({success: true, message: "Booking success!"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Not Available!"});
    }
});

module.exports = router;
