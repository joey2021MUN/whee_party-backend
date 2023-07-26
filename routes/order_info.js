var express = require("express");
var router = express.Router();
const OrderInfo = require("../model/order_info");

/**
 * @swagger
 * /order-info:
 *   post:
 *     summary: Create an order info for a party, including party theme, pizzas, drinks, tablecloth color
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             order_id:
 *               type: integer
 *             package_id:
 *               type: integer
 *             party_theme:
 *               type: string
 *               description: The first and second choice of the party theme
 *               example: "Super Mario"
 *             pizzas:
 *               type: string
 *               description: The pizza type and quantity
 *               example: "1 cheese, 2 pepperoni"
 *             drinks:   
 *               type: string
 *               description: The drink type and quantity
 *               example: "8 orange juice, 8 apple juice"
 *             tablecloth_color:
 *               type: string
 *             additional_request:
 *               type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response
 */

router.post('/', async function(req, res, next) {
    const order = await Order.findOne({ where: { id: req.body.order_id } });

    try {
        await OrderInfo.create({
            order_id: order['id'],
            package_id: req.body.package_id,
            party_theme: req.body.party_theme,
            pizzas: req.body.pizzas,
            drinks: req.body.drinks,
            tablecloth_color: req.body.tablecloth_color,
            additional_request: req.body.additional_request,
        });
        res.json({success: true, message: "Order info submitted!"});
    } catch (error) {
        res.json({success: false, message: "Network error, please try again!"});
    }
});

module.exports = router;
