var express = require("express");
var router = express.Router();

const PackageInfo = require("../model/package_info");

/**
 * @swagger
 * /package_info:
 *   get:
 *     summary: return infomation of three packages in database 
 *     responses:
 *       '200':
 *         description: A successful response
 */
async function packageInfoRouterHandler(req, res, next) {
  const packages = await PackageInfo.findAll();  
  res.json(packages);
}

router.get("/", packageInfoRouterHandler);

module.exports = router;
