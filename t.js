
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

Jimp.read("newregular.jpg", function (err, regular) {
   regular.rotate(0).normalize().brightness(0.3).contrast(0.00).write("img-copy.jpg", function(){
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
      im.save('./img-copy-processed.png')
    }

    separatorStore.sort(function(a, b){
      return a.y - b.y;
    });

    var arrayLength = separatorStore.length;

    for (var i = 0; i < arrayLength; i++) {
      if(separatorStore[i+1]){
        y = separatorStore[i]['y']
        y2 = separatorStore[i+1]['y'] - y
        // handle small books like if y2 < ...
        var crop = im.crop(0, y, width, y2);
        squareName =  i +'cropped.png'
        crop.convertGrayscale(1)
        crop.save('./crop/'+ squareName)
      } else { return }
    }
    console.log(separatorStore)
    console.log('Image saved as img-copy-processed.png to local folder');
  });

  ////////////////////////////////////////////////////

  const tesseractOptions = {
    l: 'fra+eng',
    psm: 5
  }

  console.log(separatorStore.length-3)

  for (var i = 0; i < separatorStore.length-3; i++) {
    var imgName = i+'cropped.png'
    console.log(imgName)

    tesseract.process(__dirname + '/crop/' + imgName, tesseractOptions, function(err, text)  {
      if(err) {
        console.error(err);
      } else {
        if(text){
        console.log('book text is: ' + text);
        }

      }
    });


  }

}
