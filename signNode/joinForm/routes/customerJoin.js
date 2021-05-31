var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('customerJoin', {title: '구매자 회원가입!'});
});

router.post('/', function(req, res, next) {
  console.log('req.body: ' + JSON.stringify(req.body));
  res.json(req.body);
});

module.exports = router;
