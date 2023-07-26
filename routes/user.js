var express = require('express');
var router = express.Router();

const { isEmailValid, isPhoneNumberValid } = require('../utils/form_utils');
const User = require('../model/user');
const jwt = require('../jwt');
const authentication_token = require('../authentication_token');

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Update self user
 *     requestBody:
 *           required: true
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   full_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone_number:
 *                     type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response
 *       '401':
 *         description: Unauthorized
 */
router.put('/', authentication_token, async function(req, res, next) {
    const userEmail = req.legit['email'];
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
        return res.json({ success: false, message: "User not found!" });
    }

    const { full_name, email, phone_number } = req.body;
    
    if (full_name) {
        user.full_name = full_name;
    }

    if (email) {
        if (!isEmailValid(email)) {
            return res.json({ success: false, message: "Invalid email!" });
        }
        user.email = email;
    }

    if (phone_number) {
        if (!isPhoneNumberValid(phone_number)) {
            return res.json({ success: false, message: "Invalid phone number!" });
        }
        user.phone_number = phone_number;
    }

    try {
        await user.save();
        return res.json({ success: true, message: "Success." });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

/**
 * @swagger
 * /user:
 *  post:
 *   summary: Create new user
 *   requestBody:
 *      required: true
 *      content:
 *          application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                    full_name:
 *                        type: string
 *                    email:
 *                        type: string
 *                    phone_number:
 *                        type: string
 *                    password:
 *                        type: string
 *   security:
 *     - BearerAuth: []
 *   responses:
 *     '200':
 *       description: A successful response
 *     '401':
 *       description: Unauthorized
 */
router.post('/', async function(req, res, next) {
    const { email } = req.body;
    if (!isEmailValid(email)) {
        return res.json({ success: false, message: "Invalid email!" });
    }

    try {
        const user = await User.create({
            full_name: "New User",
            email: email,
            phone_number: "0000000000",
            password: "123456",
            is_admin: false
        });

        // Create token for user
        const token = jwt.generateAccessToken(email);

        return res.json({ success: true, token: token, message: "Success." });
    }
    catch (err) {
        return res.json({ success: false, message: "Email already in use." });
    }
});

module.exports = router;
