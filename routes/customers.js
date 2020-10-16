var express = require('express');
var router = express.Router();

const db = require('../queries')();

/* GET home page. */
router.get('/', db.getCustomers);
router.get('/:id', db.getCustomerById);
router.post('/', db.createCustomer);
router.put('/:id', db.updateCustomer);
router.delete('/:id', db.deleteCustomer);

router.get('/:id/cart', db.getCustomerCartItems);
router.post('/:id/cart', db.createCustomerCartItem);
router.put('/:id/cart/:cart_item_id', db.updateCustomerCartItem);
router.delete('/:id/cart/:cart_item_id', db.deleteCustomerCartItem);

router.delete('/:id/cart', db.deleteCustomerCart);

router.get('/:id/orders', db.getOrdersByCustomerId);
router.post('/:id/orders', db.createOrderFromCustomerCart);

module.exports = router;

