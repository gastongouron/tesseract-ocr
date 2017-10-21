var Jimp = require("jimp");
const tesseract = require('node-tesseract');
const cv = require('opencv');
const fs = require('fs')

////////////////////////////////////////////////////

var lowThresh  = 0;
var highThresh = 100;
var nIters     = 2;
var minArea    = 20000;
var BLUE  = [255, 0, 0];
var RED   = [0, 0, 255];
var GREEN = [0, 255, 0];
var WHITE = [255, 255, 255];

////////////////////////////////////////////////////

Jimp.read("regular.jpg", function (err, regular) {
   regular.normalize().brightness(0.3).contrast(0.00).write("img-copy.jpg", function(){
     startProcedure()
   });
});

var x = 0
var y = 0
var w = 0
var h = 0

var startProcedure = function(){
  cv.readImage('./img-copy.jpg', function(err, im) {

    if (err) throw err;

    separatorStore = []
    width = im.width()
    height = im.height()

    if (width < 1 || height < 1) throw new Error('Image has no size (probably no image or wrong path)');

    var out = new cv.Matrix(height, width);
    im_canny = im.copy();
    im_canny.canny(lowThresh, highThresh);
    im_canny.dilate(nIters);

    contours = im_canny.findContours();

    for (i = 0; i < contours.size(); i++) {
      if (contours.area(i) < minArea) continue;

      var arcLength = contours.arcLength(i, true);
      contours.approxPolyDP(i, 0.01 * arcLength, true);

      if(contours.cornerCount(i) < 10) {

        let rect = contours.minAreaRect(i);

        for (let k = 0; k < 4; k++) {

          var x = rect.points[k].x
          var y = rect.points[k].y
          var secondPointXcoord = rect.points[(k+1)%4].x
          var secondPointYcoord = rect.points[(k+1)%4].y

          if(Math.abs(secondPointXcoord - x) > 100){
            im.line([0, y], [width, y], RED, 5);
            obj = {
              x: 0,
              y: Math.round(y),
            }
            separatorStore.push(obj)
          }
        }
      }
    }
    separatorStore.sort(function(a, b){
      return a.y - b.y;
    });

    var arrayLength = separatorStore.length;
    for (var i = 0; i < arrayLength; i++) {
      console.log(separatorStore[i])
      console.log(separatorStore[i+1])
      console.log(separatorStore[i]['y'])

      // console.log(separatorStore[i-1])

      if(separatorStore[i+1]){
        y = separatorStore[i]['y']
        y2 = separatorStore[i+1]['y'] - y
        var crop = im.crop(0, y, width, y2);
        crop.save('./'+ i +'cropped.png')
      }else{
        return
      }

      //   x = separatorStore[i-1]['x']
      // }else{
      //   x = 0
      // };



    }

    // console.log(separatorStore)
    // console.log(height)
    im.save('./img-copy-processed.png')
    console.log('Image saved as ko.jpg to local folder.png');
  });
}

////////////////////////////////////////////////////

// const tesseractOptions = {
//  l: 'fra',
//  psm: 4
// };

// tesseract.process(__dirname + './regular2.png', tesseractOptions, function(err, text) {
//  if(err) {
//    console.error(err);
//  } else {
//    var logger = fs.createWriteStream(text+'.txt', {
//        flags: 'a'
//    })
//    console.log(text);
//    logger.write(text)
//    logger.end()
//  }
// });
