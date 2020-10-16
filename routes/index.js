const express = require('express');
const router = express.Router();
const userDb = require('../userDb')();
const auth = require('../auth');
const db = require('../queries')();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', db.login);

module.exports = router;
