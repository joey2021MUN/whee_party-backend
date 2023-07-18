var express = require("express");
var router = express.Router();

const Order = require("../model/order");
const User = require("../model/user");
const Note = require("../model/note");
const PackageInfo = require("../model/package_info");

const { useAllTimeSlots } = require("../model/time_slot");

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
 *                     description: Date of the party
 *                     example: "2023-08-01"
 *                   time_slot_id:
 *                     type: integer
 *                     description: Time slot of the party
 *                     example: 1
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response
 *       '401':
 *         description: Unauthorized
 */
router.post("/", async function (req, res, next) {
  const date = new Date(req.body.date);
  const timeSlotId = req.body.time_slot_id;

  const userEmail = req.legit["email"];
  const user = await User.findOne({ where: { email: userEmail } });
  if (!user) {
    return res.json({ success: false, message: "User not found!" });
  }

  try {
    await Order.create({
      order_date: date,
      time_slot_id: timeSlotId,
      user_id: user["id"],
      is_user_order: true,
      reason: "",
    });
    res.json({ success: true, message: "Booking success!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Not Available!" });
  }
});

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get all orders
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response
 *       '401':
 *         description: Unauthorized
 */
router.get("/", async function (req, res, next) {
  const userEmail = req.legit["email"];
  const user = await User.findOne({ where: { email: userEmail } });

  if (!user) {
    return res.json({ success: false, message: "User not found!" });
  }

  /// TODO: 用单次查询优化
  const orders = await Order.findAll({
    where: { user_id: user["id"] },
    order: [["order_date", "DESC"]],
  });
  const timeSlots = useAllTimeSlots();
  let resultOrders = [];

  for (let order of orders) {
    let resultOrder = order.toJSON();

    // Undefined values won't be sent to frontend
    // Must convert to null
    resultOrder["payment_id"] = order["payment_id"] || null;

    const slot = timeSlots.find((slot) => slot["id"] === order["time_slot_id"]);
    resultOrder["time_slot"] = `${slot["start_time"]} - ${slot["end_time"]}`;

    const note = await Note.findOne({ where: { order_id: order["id"] } });
    if (!note) {
      resultOrder["note_id"] = 0;
      resultOrder["package_id"] = 0;
      resultOrder["package_name"] = "Not Selected";
      resultOrder["package_price"] = 0;
      resultOrder["package_description"] = "Not Selected";
    } else {
      const packageInfo = await PackageInfo.findOne({
        where: { id: note["package_id"] },
      });

      resultOrder["note_id"] = note["id"];
      resultOrder["package_id"] = note["package_id"];
      resultOrder["package_name"] = packageInfo["name"];
      resultOrder["package_price"] = packageInfo["price"];
      resultOrder["package_description"] = packageInfo["description"];
    }

    resultOrders.push(resultOrder);
  }

  res.json({ success: true, orders: resultOrders });
});

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     summary: Delete an order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the order to delete
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response
 *       '401':
 *         description: Unauthorized
 */
router.delete("/:id", async function (req, res, next) {
  const userEmail = req.legit["email"];
  const user = await User.findOne({ where: { email: userEmail } });

  if (!user) {
    return res.json({ success: false, message: "User not found!" });
  }

  const orderId = req.params.id;
  const order = await Order.findOne({ where: { id: orderId } });
  if (!order) {
    return res.json({ success: false, message: "Order not found!" });
  }

  if (order["user_id"] !== user["id"]) {
    return res.json({
      success: false,
      message: "You are not allowed to delete this order!",
    });
  }

  try {
    await Order.destroy({ where: { id: orderId } });
    res.json({ success: true, message: "Order deleted!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Order not deleted!" });
  }
});

module.exports = router;
