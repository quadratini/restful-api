var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});

router.post('/', (req, res) => {
  return res.send('Received a POST HTTP method');
});

router.put('/:userId', (req, res) => {
  return res.send(`PUT HTTP method on user/${req.params.userId} resource`);
});

router.delete('/:userId', (req, res) => {
  return res.send(`DELETE HTTP method on user/${req.params.userId} resource`);
});

module.exports = router;
