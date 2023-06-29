var express = require('express');
var router = express.Router();
const User = require('../model/user');

/**
 * @swagger
 * /greetings:
 *   get:
 *     summary: Check a token and return a greeting message
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response
 */
router.get('/', async function(req, res, next) {
  const email = req.legit['email'];
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return res.json({ success: false, message: "User not found!" });
  }
  res.json({
      success: true, 
      message: `Hello, ${user['full_name']}`, 
      email: email,
      full_name: user['full_name'],
    });
});

module.exports = router;
