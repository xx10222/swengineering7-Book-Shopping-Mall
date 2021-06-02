var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('bookDetailUpdate', {title: '책 상세 수정 페이지'});
});

router.post('/', function(req, res, next) {
  console.log('req.body: ' + JSON.stringify(req.body));
  res.json(req.body);
});

module.exports = router;