var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Timestamp app', url: 'https://quiet-depths-61139.herokuapp.com' });
});

router.get('/:getDate', function (req, res) {
  var getDate = req.params.getDate;
  console.log(getDate);
  var dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric"
  }

  if (isNaN(getDate)) {
    var myDate = new Date(getDate);
    console.log("Natural: " + myDate);
    var naturalDate = myDate.toLocaleDateString("en-uk", dateOptions);
    var unixDate = myDate.getTime() / 1000;
  } else {
    var myDate = new Date(getDate * 1000);
    var naturalDate = myDate.toLocaleDateString("en-uk", dateOptions);
    var unixDate = myDate.getTime() / 1000;
  }

  if (moment(myDate).isValid()) {
    res.json({
      unix: unixDate,
      natural: naturalDate
    })
  } else {
    res.json({
      unix: null,
      natural: null
    })
  }



})

module.exports = router;