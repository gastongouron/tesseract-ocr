const tesseract = require('node-tesseract');
const cv = require('opencv');
const fs = require('fs')

const tesseractOptions = {
	l: 'eng',
	psm: 4
};

tesseract.process(__dirname + './noam.png', tesseractOptions, function(err, text) {
	if(err) {
		console.error(err);
	} else {
		var logger = fs.createWriteStream(text+'.txt', {
  			flags: 'a'
		})
		console.log(text);
		logger.write(text)
		logger.end()
	}
});

var lowThresh  = 0;
var highThresh = 110;
var nIters     = 2;
var minArea    = 10000;

var BLUE  = [255, 0, 0];
var RED   = [0, 0, 255];
var GREEN = [0, 255, 0];
var WHITE = [255, 255, 255];

var copytoxformats= function(im){
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

  if (width < 1 || height < 1) throw new Error('Image has no size (probably no image or wrong path)');

  copytoxformats(im);

  var out = new cv.Matrix(height, width);
  im.convertGrayscale();
  im_canny = im.copy();
  im_canny.canny(lowThresh, highThresh);
  im_canny.dilate(nIters);

  contours = im_canny.findContours();

  var size = contours.size();
  console.log(size);
  // Count of corners(verticies) of contour `index`
  // var index = contours.cornerCount(index);
  console.log('cool')
  // Access vertex data of contours
  for(var c = 0; c < contours.size(); ++c) {
    console.log("Contour " + c);
    for(var i = 0; i < contours.cornerCount(c); ++i) {
      var point = contours.point(c, i);
      console.log("(" + point.x + "," + point.y + ")");
    }
  }

  // try different approach with controur data (prefered)
  for (i = 0; i < contours.size(); i++) {

    if (contours.area(i) < minArea) continue;
    // contours.arcLength(i, true)

    var arcLength = contours.arcLength(i, true);
    contours.approxPolyDP(i, 0.01 * arcLength, true);

    // console.log(contours.cornerCount(i));
    if(contours.cornerCount(i) < 10) {

    console.log(contours.minAreaRect(i))
        // img_crop = im.crop(50,50,250,250);
        // img_crop.save('./crop.png');
        // im.Convert()
        im.drawContour(contours, i, RED);
        out.drawContour(contours, i, WHITE);
    }
  }

  im.save('./clear.png')
  out.save('./ko.jpg');
  console.log('Image saved as ko.jpg to local folder.png');
});
