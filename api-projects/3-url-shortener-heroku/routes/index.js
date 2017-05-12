var express = require('express');
var router = express.Router();
var validURL = require('valid-url');

// Mongo DB setup
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongoURL = process.env.MONGOLAB_URL;

// NB Change this before hosting on heroku
var baseURL = "https://fathomless-basin-29562.herokuapp.com/"

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


// If any text is added to the homepage, then
router.get('/new/:enterText(*)', function (req, res, next) {

  var enterText = req.params.enterText;
  console.log(enterText);

  // Need to check if it's an URL or a shortcode: using valid-url
  if (validURL.isWebUri(enterText)) {
    console.log("Looks like a valid url");

    // If it's a valid url, connect to the db and insert a new object
    MongoClient.connect(mongoURL, function (err, db) {

      if (err) {
        console.log("Unable to connect to Mongo DB. Error: ", err);
        var shortURL = "Sorry, there was an error connecting to the database"
      } else {
        console.log("Connect to Mongo DB");
        var urlDB = db.collection('urls');
        var shortURL = (Math.random() + 1).toString(36).substring(2, 10);
        console.log(shortURL);

        var insertURL = function () {
          // Check if this shortURL is in the db
          urlDB.findOne({
            "shortURL": shortURL
          }, function (err, result) {
            if (err) {
              console.log("This is an err")
            }
            if (!result) {
              console.log("And this is no result")
              // Code to insert something into the db
              urlDB.insertOne({
                "longName": enterText,
                "shortURL": shortURL
              })
            } else {
              shortURL = (Math.random() + 1).toString(36).substring(2, 10);
              insertURL();
            }
          })

        }
        insertURL();

        db.close();
      }
      res.send({
        "original_url": enterText,
        "short_url": baseURL + shortURL
      })
    })

  } else {
    res.send({
      "error": "The app didn't recognise an URL. Please enter in the format http://www.google.com"
    })
  }



})

router.get('/:findShortCode', function(req, res, next) {
  var shortCode = req.params.findShortCode;
  console.log(shortCode);
  if(shortCode.length != 8) {
    console.log("Doesn't look like a shortCode to me");
    res.send("That doesn't look like a short code...")
  } else {
    // If it's 8 characters long, then try to find in the DB. 
    MongoClient.connect(mongoURL, function (err, db) {

      if (err) {
        console.log("Unable to connect to Mongo DB. Error: ", err);
      } else {
        console.log("Connected to Mongo DB");
        var urlDB = db.collection('urls');
        console.log("Connected to urls collection");

        urlDB.findOne({
          "shortURL": shortCode
        }, {
          "shortURL": 1,
          "longName": 1,
          "_id": 0
        }, function(err, results) {
          if(err) {
            console.log("Error finding the short code in the db")
          }
          if(!results) {
            res.send("We couldn't find that code in the database, maybe try again?");
          } else {
            var longName = results.longName;
            console.log(longName);
            res.redirect(longName);


          }
        })

        db.close();
      }
      
    })
  }
})


module.exports = router;
