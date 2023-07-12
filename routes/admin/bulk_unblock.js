
var express = require('express');
var router = express.Router();

const { Op } = require('sequelize');
const { sequelize } = require('../../database');
const { useAllTimeSlots } = require('../../model/time_slot');
const Order = require('../../model/order');

/**
 * @swagger
 * /admin/bulk-unblock:
 *   post:
 *     summary: Unblock multiple timeslots
 *     requestBody:
 *           required: true
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   start_date:
 *                     type: string
 *                     example: "2023-08-01"
 *                   end_date:
 *                     type: string
 *                     example: "2023-09-01"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response
 *       '401':
 *         description: Unauthorized
 */
router.post('/bulk-unblock', async function(req, res, next) {
    const startDate = new Date(Date.parse(req.body.start_date));
    const endDate = new Date(Date.parse(req.body.end_date));

    if (isNaN(startDate) || isNaN(endDate)) {
        return res.json({ success: false, message: "Invalid date!" });
    }

    if (startDate > endDate) {
        return res.json({ success: false, message: "Start date must be before end date!" });
    }

    try {
        await Order.destroy({
            where: {
                order_date: {
                    [Op.between]: [startDate, endDate],
                },
                is_user_order: false,
            },
        });
        res.json({success: true, message: "Bulk unblock success!"});
    }
    catch (e) {
        res.json({success: false, message: "Bulk unblock failed: " + e });
    }
});

module.exports = router;
