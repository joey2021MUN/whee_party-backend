var express = require('express');
var router = express.Router();

const User = require('../model/user');

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
router.put('/', async function(req, res, next) {
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
        user.email = email;
    }

    if (phone_number) {
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

module.exports = router;
