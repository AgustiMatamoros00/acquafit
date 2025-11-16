const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message: 'Welcome to AcquaFit API - Windows Version with SQL Server' });
});

module.exports = router;

