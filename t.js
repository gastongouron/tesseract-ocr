const jimp = require("jimp");
const cv   = require('opencv');
const fs   = require('fs')
const eto  = require('easy-tesseract-ocr');

////////////////////////////////////////////////////

const WHITE = [255, 0, 255];
const RED   = [255, 0, 0];
const PURPL = [0, 255, 255];

////////////////////////////////////////////////////

const lowThresh  = 0;
const highThresh = 100;
const iterations = 1;
const minArea    = 1000;
// const ratio      =3;
// const kernel_size =3

////////////////////////////////////////////////////

var img           = "regular.jpg"
// var img           = "input.jpg"
var jimped        = "jimped-test.jpg"
var processed     = "jimped-test-processed.jpg"
var processedCopy = "jimped-test-processed-copy.jpg"

////////////////////////////////////////////////////

// Might need to .scaleToFit(3000, 3000) to normalize all inputs
jimp.read(img, function (err, regular) {
   regular.rotate(0).scaleToFit(1000, 1000).normalize().contrast(0.0).brightness(0.0).write(jimped, function(){
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
    let test = im.copy()

    // Process i so it's BW
    gray.convertGrayscale()
    // test.convertGrayscale()

    gray.canny(lowThresh, highThresh);
    test.canny(lowThresh, highThresh);
    gray.dilate(1.22);
    // test.dilate(1.22)


    // Get contours of every object found in the image
    let contours = gray.findContours();
    // test.drawAllContours(contours, WHITE)

    // let contours = test.findContours();
    // let largestArea = 0;
    // let largestAreaIndex;

    // for (let i = 0; i < contours.size(); i++) {
    //   if (contours.area(i) > largestArea) {
    //     largestArea = contours.area(i);
    //     test.drawContour(contours, i, PURPL, 1, 2);
    //   }
    // }


    console.log(gray.findContours.toString())

    // For each contour check its area,
    for (i = 0; i < contours.size(); i++) {

      // Skip small areas
      if (contours.area(i) < minArea) continue;

      // Do magic with arcLength finding objects contours
      var arcLength = contours.arcLength(i, true);
      contours.approxPolyDP(i, 0.0001 * arcLength, true);

      if(contours.cornerCount(i) < 1000) {

        let rect = contours.minAreaRect(i);

        // console.log(contours.minAreaRect(i)['size'])
        // Check area size

        // let rectWidth    = contours.minAreaRect(i)['size']['width']
        // let rectHeight   = contours.minAreaRect(i)['size']['height']
        // let area         = rectWidth * rectHeight
        // let isNotTooHigh = rectHeight < (height - 100)
        // let isNotTooWide = rectWidth < (width - (width/4))
        // let isNotTooSmall= rectWidth > (width - (width/5))

        // let center = if rectangle is r: center: (r.x + r.width/2,  r.y+r.height/2)
        // if(isNotTooHigh && isNotTooWide && area > minArea){
        // if((rectWidth < rectHeight)){
          for (let i = 0; i < 4; i++) {
            gray.line([rect.points[i].x, rect.points[i].y], [rect.points[(i+1)%4].x, rect.points[(i+1)%4].y], RED, 1);
          }
        // }

      }

    }

    // Save image
    test.save('TEST.png')
    gray.save(processed)
  });

}

////////////////////////////////////////////////////

// Separate each book into a specific image so it's easier to scan

////////////////////////////////////////////////////

// Scan images

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