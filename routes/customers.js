var express = require('express');
var router = express.Router();

const db = require('../queries');

/* GET home page. */
router.get('/', db.getCustomers);
router.get('/:id', db.getCustomerById);
router.post('/', db.createCustomer)
router.put('/:id', db.updateCustomer)
router.delete('/:id', db.deleteCustomer)

module.exports = router;
