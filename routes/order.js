var express = require("express");
var router = express.Router();

const Order = require("../model/order");
const User = require("../model/user");
const PackageInfo = require("../model/package_info");
const OrderInfo = require("../model/order_info");
const Payment = require("../model/payment");
const PaymentStatus = require("../enum/payment_status");

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
      user_id: user["id"],
      time_slot_id: timeSlotId,
      order_date: date,
      cancelled: false,
      reason: "",
    });
    res.json({ success: true, message: "Booking success!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Not Available!" });
  }
});

// TODO: optimize with single query
async function getPaymentStatus(order) {
  const orderInfo = await OrderInfo.findOne({
    where: { order_id: order["id"] },
  });
  if (!orderInfo) {
    return PaymentStatus.PACKAGE_NOT_SELECTED;
  }
  const package = await PackageInfo.findOne({
    where: { id: orderInfo["package_id"] },
  });
  const priceToPay = package["price"]; // TODO: discount
  const payments = await Payment.findAll({ where: { order_id: order["id"] } });

  if (payments.length === 0) {
    // No payment
    return PaymentStatus.NOT_PAID;
  }

  // Calculate total paid
  let totalPaid = 0;
  for (let payment of payments) {
    totalPaid += payment["total"];
  }

  return totalPaid >= package["price"]
    ? PaymentStatus.FULLY_PAID
    : PaymentStatus.PARTIALLY_PAID;
}

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
    
    resultOrder["payment_status"] = await getPaymentStatus(order);

    const slot = timeSlots.find((slot) => slot["id"] === order["time_slot_id"]);
    resultOrder["time_slot"] = `${slot["start_time"]} - ${slot["end_time"]}`;

    const order_info = await OrderInfo.findOne({ where: { order_id: order["id"] } });
    if (!order_info) {
      resultOrder["order_info_id"] = 0;
      resultOrder["package_id"] = 0;
      resultOrder["package_name"] = "Package Not Selected";
      resultOrder["package_price"] = 0;
      resultOrder["package_description"] = "Package Not Selected";
    } else {
      const packageInfo = await PackageInfo.findOne({
        where: { id: order_info["package_id"] },
      });

      resultOrder["order_info_id"] = order_info["id"];
      resultOrder["package_id"] = order_info["package_id"];
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
 * /order/cancel:
 *   post:
 *     summary: Delete an order
 *     requestBody:
 *           required: true
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   order_id:
 *                     type: number
 *                     example: "22"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response
 *       '401':
 *         description: Unauthorized
 */
router.post("/cancel", async function (req, res, next) {
  const userEmail = req.legit["email"];
  const user = await User.findOne({ where: { email: userEmail } });

  if (!user) {
    return res.json({ success: false, message: "User not found!" });
  }

  const orderId = req.body.order_id;
  const order = await Order.findOne({ where: { id: orderId } });
  if (!order) {
    return res.json({ success: false, message: "Order not found!" });
  }

  if (order["user_id"] !== user["id"]) {
    return res.json({
      success: false,
      message: "You can only cancel your own order!",
    });
  }

  try {
    order.cancelled = true;
    await order.save();
    res.json({ success: true, message: "Order deleted!" });
  } catch (error) {
    res.json({ success: false, message: "Order not deleted: " + error });
  }
});

module.exports = router;
