var express = require('express');
var router = express.Router();
var multer = require('multer');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'File Metadata Microservice' });
});

module.exports = router;
