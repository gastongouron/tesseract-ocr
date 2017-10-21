const tesseract = require('node-tesseract');
const cv = require('opencv');
const fs = require('fs')

// const tesseractOptions = {
// 	l: 'eng',
// 	psm: 4
// };

// tesseract.process(__dirname + './noam.png', tesseractOptions, function(err, text) {
// 	if(err) {
// 		console.error(err);
// 	} else {
// 		var logger = fs.createWriteStream(text+'.txt', {
//   			flags: 'a'
// 		})
// 		console.log(text);
// 		logger.write(text)
// 		logger.end()
// 	}
// });

var lowThresh  = 0;
var highThresh = 100;
var nIters     = 2;
var minArea    = 20000;

var BLUE  = [255, 0, 0];
var RED   = [0, 0, 255];
var GREEN = [0, 255, 0];
var WHITE = [255, 255, 255];

var convertToTestFormats= function(im){
  img_hsv = im.copy();
  img_gray = im.copy();
  img_hsv.convertHSVscale();
  img_gray.convertGrayscale();
  im.save('./nor.png');
  img_hsv.save('./hsv.png');
  img_gray.save('./gray.png');
};

cv.readImage('./regular.jpg', function(err, im) {

  if (err) throw err;

  width = im.width()
  height = im.height()
  console.log(width)
  console.log(height)
  if (width < 1 || height < 1) throw new Error('Image has no size (probably no image or wrong path)');

  convertToTestFormats(im);

  var out = new cv.Matrix(height, width);
  // im.convertGrayscale();
  im_canny = im.copy();
  im_canny.canny(lowThresh, highThresh);
  im_canny.dilate(nIters);

  contours = im_canny.findContours();

  var size = contours.size();

  // Access vertex data of contours
  // for(var c = 0; c < contours.size(); ++c) {
  //   // console.log("Contour " + c);
  //   for(var i = 0; i < contours.cornerCount(c); ++i) {
  //     var point = contours.point(c, i);
  //     // console.log("(" + point.x + "," + point.y + ")");
  //   }
  // }

  let largestArea = 500;
  let largestAreaIndex;
  var arr = []
  // try different approach with controur data (prefered)
  for (i = 0; i < contours.size(); i++) {

    if (contours.area(i) < minArea) continue;
    // contours.arcLength(i, true)

    var arcLength = contours.arcLength(i, true);
    contours.approxPolyDP(i, 0.01 * arcLength, true);
    // console.log(contours.cornerCount(i));
    if(contours.cornerCount(i) < 10) {

    var points = [
      contours.point(i, 0),
      contours.point(i, 1)
    ]

    out.line([points[0].x,points[0].y], [points[1].x, points[1].y], RED);


    let rect = contours.minAreaRect(i);

    for (let i = 0; i < 4; i++) {
      im.line([rect.points[i].x, rect.points[i].y], [rect.points[(i+1)%4].x, rect.points[(i+1)%4].y], GREEN, 3);
      // console.log(i + ' -> ' + rect.points[i].x, rect.points[i].y, rect.points[(i+1)%4].x, rect.points[(i+1)%4].y)
    }

    var p0x = rect.points[0].x > 0 ? rect.points[0].x : 0
    var p0y = rect.points[0].y > 0 ? rect.points[0].y : 0
    var p2x = rect.points[1].x > 0 ? rect.points[1].x : 0
    var p2y = rect.points[1].y > 0 ? rect.points[1].y : 0

    // var newZero = lasty || 0
    // console.log('newzero is: ' + newZero)
    // console.log(['p0x: ' + p0x,'p0y: ' +  p0y,'p2x: ' +  p2x,'p2y: ' +  p2y])
    // console.log([ 0, height-p2y ,width, height-p0y])

    // arr.push(height-p0y)
    // var total=0;
    // for(var a in arr) { total += arr[a]; }
    // console.log(total)
    // console.log(arr)

    img_crop = im.crop(0, height-p2y ,width, height-p0y)
    img_crop.save('./'+i+'crop.png');



    // var lasty = height-p0y
    // console.log(lasty)
    // img_crop.save('./crop'+i+'.png');
    // im.drawContour(contours, i, RED);
    out.drawContour(contours, i, WHITE);
    }
  }

  im.save('./clear.png')
  out.save('./ko.jpg');
  console.log('Image saved as ko.jpg to local folder.png');
});
