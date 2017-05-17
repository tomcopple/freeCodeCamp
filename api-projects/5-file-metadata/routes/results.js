var express = require('express');
var router = express.Router();
var multer = require('multer');

// Where to store temporary uploaded files?
var storage = multer.memoryStorage();
var tmp = multer({
    storage: storage,
    limits: {
        fileSize: 10000000
    }
}).single("uploadFile");



// Post request
router.post('/', tmp, function (req, res, next) {
    var fileSize = req.file.size;
    console.log(fileSize);
    res.json({ size: fileSize })
})

module.exports = router;
