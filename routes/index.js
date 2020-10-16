const express = require('express');
const router = express.Router();
const auth = require('../auth');
const db = require('../queries')();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({ msg: 'hello' });
});

router.post('/login', [auth.notLoggedIn], db.login);
router.post('/register', [auth.notLoggedIn], db.createCustomer);
// TODO delete this
router.get('/token', db.token);

module.exports = router;
