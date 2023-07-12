var express = require("express");
var router = express.Router();
const User = require("../model/user");
const jwt = require("../jwt");
const sha256 = require("js-sha256");

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Sign in with email and return a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "123@gmail.com"
 *     responses:
 *       '200':
 *         description: A successful response
 */
router.post("/", async function (req, res, next) {
  const email = req.body.email;
  //const password = req.body.password;

  // email validation check
  if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
    return res.json({ success: false, message: "Invalid email!" });
  }

  // email cannot be empty
  if (!email) {
    return res.json({ success: false, message: "Email is empty!" });
  }

  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return res.json({ success: false, message: "User not found!" });
  }

  // hhp = h(h(plaintext))
  // pass = salt + h(hhp + salt)
  // const pass_in_db = user["password"];
  // const salt = pass_in_db.substring(0, 64);
  // const pass_calculated = salt + sha256(password + salt);
  // if (pass_in_db != pass_calculated) {
  //   return res.json({ success: false, message: "Wrong password!" });
  // }

  const token = jwt.generateAccessToken(email);

  res.json({ success: true, token: token, message: "Sign in success!" });
});

module.exports = router;
