var express = require('express');
var router = express.Router();

const { PackageInfo } = require('../database');

/* GET package info listing. */
router.get('/', async function(req, res, next) {
  const packages = await PackageInfo.findAll();
  res.json(packages);
});

module.exports = router;
