var express = require('express');
var router = express.Router();
const auth = require('../auth');

const db = require('../queries')();

router.use(auth.isLoggedIn);

/* GET home page. */
router.get('/', db.getItems);
router.get('/:id', db.getItemById);
router.post('/', [auth.isAdmin], db.createItem);
router.put('/:id', [auth.isAdmin], db.updateItem);
router.delete('/:id', [auth.isAdmin], db.deleteItem);

module.exports = router;
