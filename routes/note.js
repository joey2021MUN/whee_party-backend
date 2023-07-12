var express = require("express");
var router = express.Router();
const PackageInfo = require("../model/note");
const Note = require("../model/note");

/**
 * @swagger
 * /note:
 *   post:
 *     summary: Create a note for a party, including party theme, pizzas, drinks, tablecloth color
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
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
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response
 */

router.post('/', async function(req, res, next) {
    
    const partyTheme = new String(req.body.party_theme);
    const noteId = req.body.id;
    const pizzas = req.body.pizzas;
    const drinks = req.body.drinks;
    const tableclothColor = req.body.tablecloth_color;
    const note = await Note.findOne({ where: { id: noteId } });

    try {
        await Note.create({
            id: noteId,
            party_theme: partyTheme,
            pizzas: pizzas,
            drinks: drinks,
            tablecloth_color: tableclothColor,
        });
        res.json({success: true, message: "Note submitted!"});
    } catch (error) {
        res.json({success: false, message: "Network error, please try again!"});
    }
});

module.exports = router;