var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var headers = req.headers;
  var ipAddress = req.headers['x-forwarded-for'];
  res.send({
    'ipaddress': ipAddress,
    'language': headers['accept-language'].split(',')[0],
    'software': headers['user-agent'].split(' (')[1].split(') ')[0]
  })
  // res.render('index', { ipaddress: req.ip, language: headers.accept-language, software: headers.user-agent });
  
});

module.exports = router;
