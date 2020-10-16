var express = require('express');
var router = express.Router();
const auth = require('../auth');

const db = require('../queries')();

router.use(auth.isLoggedIn);

const isAdminOrCurCustomer = async function(req, res, next) {
    if (req.customer.role >= 2 || req.customer.customer_id == req.params.id) {
        next();
    } else {
        res.status(500).json({'error': 'Permission denied'});
    }
};

/* GET home page. */
router.get('/', [auth.isAdmin], db.getCustomers);
router.get('/:id', [isAdminOrCurCustomer], db.getCustomerById);
router.put('/:id', [isAdminOrCurCustomer], db.updateCustomer);
router.delete('/:id', [isAdminOrCurCustomer], db.deleteCustomer);

router.get('/:id/cart', [isAdminOrCurCustomer], db.getCustomerCartItems);
router.post('/:id/cart', [isAdminOrCurCustomer], db.createCustomerCartItem);
router.put('/:id/cart/:cart_item_id', [isAdminOrCurCustomer], db.updateCustomerCartItem);
router.delete('/:id/cart/:cart_item_id', [isAdminOrCurCustomer], db.deleteCustomerCartItem);

router.delete('/:id/cart', [isAdminOrCurCustomer], db.deleteCustomerCart);

router.get('/:id/orders', [isAdminOrCurCustomer], db.getOrdersByCustomerId);
router.post('/:id/orders', [isAdminOrCurCustomer], db.createOrderFromCustomerCart);

module.exports = router;

