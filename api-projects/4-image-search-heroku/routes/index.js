var express = require('express');
var router = express.Router();
var https = require('https');
var MongoClient = require('mongodb').MongoClient;

// Set various authentication here
// NB To set in global environment, export GOOGLE_API="google_api_key"
// Don't forget to heroku config:set googleAPI='google_api_key'
var googleAPI = process.env.GOOGLE_API_KEY;
var dbPassword = process.env.DB_PASSWORD;
console.log(process.env);
console.log(process.env.GOOGLE_API_KEY);
console.log(process.env.DB_PASSWORD);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Search Abstraction Layer' });
});

router.get('/:searchImage(*)', function(req, res, next) {

  // Get search term
  var searchImage = req.params.searchImage;
  if(searchImage.includes("favicon")) {
    res.send(
      "Error, this could be related to an unusual search term, please try again."
    );
    return;
  }

  // Create GET url
  var googleSearch = 'https://www.googleapis.com/customsearch/v1'
  googleSearch += "?key=" + googleAPI;
  googleSearch += "&cx=" + '002784531835733696961:cmbmihpvsqq';
  googleSearch += "&q=" + searchImage;
  console.log(googleSearch);

  // Create empty array for final JSON
  var rawResults = [];

  // Create the http GET request using http
  https.get(googleSearch, function(response) {
    console.log('status code:' + response.statusCode);
    response.setEncoding('utf8');
    response.on('data', function(data) {
      // Add the json to the empty array
      rawResults += data;
    });
    response.on('end', function() {
      imagesRaw = JSON.parse(rawResults).items;
      imagesRes = [];
      try { imagesRaw.length } catch(err) { res.send("No results found, please try again"); return; }
      for(var i = 0; i < imagesRaw.length; i++) {
        console.log('Title ', i+1, ': ', imagesRaw[i].title);
        console.log('Image link ', i+1, ': ', imagesRaw[i].pagemap.cse_image[0].src);
        // try {console.log('Thumbnail link ', i+1, ': ', imagesRaw[i].pagemap.cse_thumbnail[0].src)} catch(err) {console.log('Thumbnail link ', i+1, ': ', imagesRaw[i].pagemap.thumbnail[0].src)};
        console.log('Page link ', i+1, ': ', imagesRaw[i].link);
        // NB Sometimes it's called thumbnail, sometimes it's called cse_thumbnail
        try {
          try {
            var thumbnail = imagesRaw[i].pagemap.cse_thumbnail[0].src
          } catch(err) {
            var thumbnail = imagesRaw[i].pagemap.thumbnail[0].src
          }
        } catch(err) {
          var thumbnail = "";
        }
        var newImage = {
          'title': imagesRaw[i].title,
          'url': imagesRaw[i].pagemap.cse_image[0].src,
          'thumbnail': thumbnail,
          'context': imagesRaw[i].link
        }
        // console.log(newImage);
        imagesRes.push(newImage);

      }
      res.send(imagesRes);

      // Finally log result to mondoDB
      var mongoURL = "mongodb://tomcopple:" + dbPassword + "@ds127321.mlab.com:27321/image-search";
      MongoClient.connect(mongoURL, function(err, db) {
        if (err) { console.error("Problem connecting to mongodb") }
        else {
          console.log("Connected to mongodb");
          db.collection('image-search').insertOne({
            "term": searchImage,
            "when": new Date().toLocaleString()
          });
          db.close();
        }
      })
      
    })
  })


})


module.exports = router;
