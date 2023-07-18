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

// Currently, user can login with email only.
router.get('/', async function(req, res, next) {
  const email = req.legit['email'];
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return res.json({ success: false, message: "User not found!" });
  }

  const userInfo = {
    id: user["id"],
    email: user["email"],
    full_name: user["full_name"],
    phone_number: user["phone_number"],
    is_admin: user["is_admin"],
  };

  res.json({
      success: true, 
      message: `Hello, ${user['full_name']}`, 
      user: userInfo,
    });
});

module.exports = router;
