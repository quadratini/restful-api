var express = require('express');
var router = express.Router();

const db = require('../queries')();

/* GET home page. */
router.get('/', db.getOrders);
router.get('/:id', db.getOrderById);
router.get('/:id/items', db.getOrderItemsByOrderId);

module.exports = router;
