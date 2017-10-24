const jimp = require("jimp");
const cv   = require('opencv');
const fs   = require('fs')
const eto  = require('easy-tesseract-ocr');

////////////////////////////////////////////////////

const WHITE = [255, 0, 255];
const RED = [255, 0, 0];

////////////////////////////////////////////////////

const lowThresh  = 0;
const highThresh = 100;
const iterations = 2;
const minArea    = 10000;

////////////////////////////////////////////////////

var img           = "input.png"
var jimped        = "jimped-test.jpg"
var processed     = "jimped-test-processed.jpg"
var processedCopy = "jimped-test-processed-copy.jpg"

////////////////////////////////////////////////////

jimp.read(img, function (err, regular) {
   regular.rotate(0).normalize().brightness(0.0).contrast(0.0).write(jimped, function(){ //.scaleToFit(3000, 3000)
    startProcedure()
  });
});

////////////////////////////////////////////////////

var startProcedure = function(){

  cv.readImage(jimped, function (err, im) {

    // Handle img errors
    if (err) { throw err; }

    // Handle no height/withd images
    const width = im.width();
    const height = im.height();
    if (width < 1 || height < 1) { throw new Error('Image has no size'); }

    // Create a gray copy of img
    let gray = im.copy()

    // Process i so it's BW
    gray.convertGrayscale()
    gray.canny(lowThresh, highThresh);
    gray.dilate(iterations);

    // Get contours of every object found in the image
    let contours = gray.findContours();
    console.log(contours)

    // For each contour check its area,
    for (i = 0; i < contours.size(); i++) {

      // Skip small areas
      if (contours.area(i) < minArea) continue;

      // Do magic with arcLength
      var arcLength = contours.arcLength(i, true);
      contours.approxPolyDP(i, 0.01 * arcLength, true);

      if(contours.cornerCount(i) < 100) {
        let rect = contours.minAreaRect(i);

        // console.log(contours.minAreaRect(i)['size'])

        if(contours.minAreaRect(i)['size']['height'] > 150){
          for (let i = 0; i < 4; i++) {
            gray.line([rect.points[i].x, rect.points[i].y], [rect.points[(i+1)%4].x, rect.points[(i+1)%4].y], RED, 3);
          }

        }

      }

    }

    // Save image
    gray.save(processed)
  });

}


// var x = 0
// var y = 0
// var w = 0
// var h = 0

  // cv.readImage('./img-copy.jpg', function(err, im) {

  //   if (err) throw err;

  //   separatorStore = []
  //   width = im.width()
  //   height = im.height()

  //   if (width < 1 || height < 1) throw new Error('Image has no size (probably no image or wrong path)');

  //   var out = new cv.Matrix(height, width);
  //   im_canny = im.copy();
  //   im_canny.canny(lowThresh, highThresh);
  //   im_canny.dilate(nIters);

  //   contours = im_canny.findContours();

  //   for (i = 0; i < contours.size(); i++) {
  //     if (contours.area(i) < minArea) continue;

  //     var arcLength = contours.arcLength(i, true);
  //     contours.approxPolyDP(i, 0.01 * arcLength, true);

  //     if(contours.cornerCount(i) < 10) {

  //       let rect = contours.minAreaRect(i);

  //       for (let k = 0; k < 4; k++) {

  //         var x = rect.points[k].x
  //         var y = rect.points[k].y
  //         var secondPointXcoord = rect.points[(k+1)%4].x
  //         var secondPointYcoord = rect.points[(k+1)%4].y

  //         if(Math.abs(secondPointXcoord - x) > 100){
  //           im.line([0, y], [width, y], RED, 5);
  //           obj = {
  //             x: 0,
  //             y: Math.round(y),
  //           }
  //           separatorStore.push(obj)
  //         }
  //       }
  //     }
  //     im.save('./img-copy-processed.png')
  //   }

  //   separatorStore.sort(function(a, b){
  //     return a.y - b.y;
  //   });

  //   var arrayLength = separatorStore.length;

  //   counter = 0
  //   for (var i = 0; i < arrayLength; i++) {
  //     if(separatorStore[i+1]){
  //       y = separatorStore[i]['y']
  //       y2 = separatorStore[i+1]['y'] - y
  //       console.log(y2)
  //       if(y2 > 50){
  //         var crop = im.crop(0, y, width, y2);
  //         squareName =  counter +'cropped.png'
  //         // crop.convertGrayscale()
  //         crop.save('./crop/'+ squareName)
  //         counter += 1
  //       }
  //     } else { return }
  //   }
  //   console.log(separatorStore)
  //   console.log('Image saved as img-copy-processed.png to local folder');
  // });

  ////////////////////////////////////////////////////




// console.log("\n-- test case 1: basic OCR scanning (english), regular.png--");
// eto.scan({
//     imagePath: './crop/4cropped.png',
//     trainedData: 'eng+fra',
//     psm: 7,
//     osm: 0
// })
// .then(function (text) {
//     console.log('[result]\n', text);
// })
// .catch(function (err) {
//     console.error(err);
// });