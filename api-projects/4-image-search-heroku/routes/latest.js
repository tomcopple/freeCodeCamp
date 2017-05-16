var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var dbPassword = process.env.DB_PASSWORD;

/* GET list of latest results. */
router.get('/', function(req, res, next) {

    var mongoURL = "mongodb://tomcopple:" + dbPassword + "@ds127321.mlab.com:27321/image-search";
      MongoClient.connect(mongoURL, function(err, db) {
        if (err) { console.error("Problem connecting to mongodb") }
        else {
          console.log("Connected to mongodb");
          db.collection('image-search').find({

          }, { 
              "term": 1, "when": 1, "_id": 0
            }).toArray(function(err, doc) {
                if (err) {console.log("Error in toArray")}
                else {
                    res.send(doc);
                    db.close();
                }
            })  
        }
      })
});

module.exports = router;
