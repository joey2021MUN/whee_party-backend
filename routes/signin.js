var express = require("express");
var router = express.Router();
const User = require("../model/user");
const jwt = require("../jwt");
const sha256 = require("js-sha256");

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Sign in with email and password and return a token
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
 *               password:
 *                 type: string
 *                 description: The user's password's sha256's sha256.
 *                 example: "A0FCBE9152B3FA32A352E0ECC2DAA5B1F8D28227E63348FFDF33C258C7B0E0ED"
 *               salt:
 *                 type: string
 *                 description: sha256(password_plaintext + timestamp + SECRET)
 *     responses:
 *       '200':
 *         description: A successful response
 */
router.post("/", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.json({ success: false, message: "Email or password is empty!" });
  }

  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return res.json({ success: false, message: "User not found!" });
  }

  // hhp = h(h(plaintext))
  // pass = salt + h(hhp + salt)
  const pass_in_db = user["password"];
  const salt = pass_in_db.substring(0, 64);
  const pass_calculated = salt + sha256(password + salt);
  if (pass_in_db != pass_calculated) {
    return res.json({ success: false, message: "Wrong password!" });
  }

  const token = jwt.generateAccessToken(email);

  res.json({ success: true, token: token, message: "Sign in success!" });
});

module.exports = router;
