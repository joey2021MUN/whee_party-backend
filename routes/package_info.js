var express = require("express");
var router = express.Router();

const PackageInfo = require("../model/package_info");

/**
 * @swagger
 * /package_info:
 *   get:
 *     summary: Show detailed information of three packages
 *     responses:
 *       '200':
 *         description: A successful response
 */
// async function packageInfoRouterHandler(req, res, next) {
//   const packages = await PackageInfo.findAll();  
//   res.json(packages);
// }

router.get("/", async function (req, res, next) {
  const packages = await PackageInfo.findAll();  
  res.json(packages);
});

module.exports = router;
