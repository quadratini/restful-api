var express = require('express');
var router = express.Router();

const db = require('../queries')();

/* GET home page. */
router.get('/', db.getItems);
router.get('/:id', db.getItemById);
router.post('/', db.createItem);
router.put('/:id', db.updateItem);
router.delete('/:id', db.deleteItem);

module.exports = router;
