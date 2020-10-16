const express = require('express');
const router = express.Router();
const auth = require('../auth');

const db = require('../queries')();

router.use(auth.isLoggedIn);

/* GET home page. */
router.get('/', [auth.isAdmin], db.getOrders);
router.get('/:id', [auth.isAdmin], db.getOrderById);
router.get('/:id/items', [auth.isAdmin], db.getOrderItemsByOrderId);

module.exports = router;
