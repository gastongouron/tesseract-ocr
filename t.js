const tesseract = require('node-tesseract');
const cv = require('opencv');


// var options = {
// 	l: 'eng',
// 	psm: 4
// 	// binary: '/usr/local/Cellar/tesseract'
// };

// // Recognize text of any language in any format
// tesseract.process(__dirname + './ko2.png', options, function(err, text) {
// 	if(err) {
// 		console.error(err);
// 	} else {
// 		console.log(text);
// 	}
// });


var lowThresh = 0;
var highThresh = 150;
var nIters = 2;
var minArea = 10000;

var BLUE  = [255, 0, 0]; // B, G, R
var RED   = [0, 0, 255]; // B, G, R
var GREEN = [0, 255, 0]; // B, G, R
var WHITE = [255, 255, 255]; // B, G, R


cv.readImage('./ok.jpg', function(err, im) {




  if (err) throw err;
  im.dilate(nIters);
  width = im.width()
  height = im.height()
  if (width < 1 || height < 1) throw new Error('Image has no size');

  img_hsv = im.copy();
  img_gray = im.copy();

  img_hsv.convertHSVscale();
  img_gray.convertGrayscale();

  im.save('./nor.png');
  img_hsv.save('./hsv.png');
  img_gray.save('./gray.png');


  var out = new cv.Matrix(height, width);
  im.convertGrayscale();
  im_canny = im.copy();
  im_canny.canny(lowThresh, highThresh);
  im_canny.dilate(nIters);

  contours = im_canny.findContours();

  for (i = 0; i < contours.size(); i++) {

    if (contours.area(i) < minArea) continue;
    // contours.arcLength(i, true)

    var arcLength = contours.arcLength(i, true);
    contours.approxPolyDP(i, 0.01 * arcLength, true);

    // console.log(contours.cornerCount(i));
    if(contours.cornerCount(i) < 10) {

      console.log(contours.area(i))
	  console.log(contours.minAreaRect(i))
      console.log(contours.cornerCount(1))
      // case 3:
      //   out.drawContour(contours, i, GREEN);
      // case 4:
      //   out.drawContour(contours, i, RED);

        // Simplify shape to square
        // get top ight bot let coordinates to draw square like:
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



// cv.readImage('./files/mona.png', function(err, im) {
//   if (err) throw err;
//   if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');

//   img_hsv = im.copy();
//   img_gray = im.copy();

//   img_hsv.convertHSVscale();
//   img_gray.convertGrayscale();

//   im.save('./tmp/nor.png');
//   img_hsv.save('./tmp/hsv.png');
//   img_gray.save('./tmp/gray.png');

//   img_crop = im.crop(50,50,250,250);
//   img_crop.save('./tmp/crop.png');

//   console.log('Image saved to ./tmp/{crop|nor|hsv|gray}.png');
// });

// cv.readImage("./test.png", function(err, im){
//   // im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
//   //   for (var i=0;i<faces.length; i++){
//   //     var x = faces[i]
//   //     im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
//   //   }
//   //   im.save('./out.png');
//   // });
//   im.convertGrayscale();
//   // im.houghLinesP();
//   im.save('./out.png');
// })


// cv.readImage("./test.png", function(err, im){
// 	im.convertGrayscale()
// 	var contours = im.findContours();
// 	console.log("cool")

// 	// Count of contours in the Contours object
// 	var size = contours.size();
// 	console.log(size);
// 	// Count of corners(verticies) of contour `index`
// 	// var index = contours.cornerCount(index);
// 	console.log('cool')
// 	// Access vertex data of contours
// 	for(var c = 0; c < contours.size(); ++c) {
// 	  console.log("Contour " + c);
// 	  for(var i = 0; i < contours.cornerCount(c); ++i) {
// 	    var point = contours.point(c, i);
// 	    console.log("(" + point.x + "," + point.y + ")");
// 	  }
// 	}

// 	// Computations of contour `index`
// 	// console.log(contours.area(index));
// 	// console.log(contours.arcLength(index, isClosed));
// 	// contours.boundingRect(index);
// 	// console.log(contours.minAreaRect(index));
// 	// console.log(contours.isConvex(index));
// 	// console.log(contours.fitEllipse(index));

// 	// Destructively alter contour `index`
// 	// contours.approxPolyDP(index, epsilon, isClosed);
// 	// contours.convexHull(index, clockwise);

//   // mat.goodFeaturesToTrack()
//   // console.log(mat.goodFeaturesToTrack())

//   // var contours = im.findCountours()
//   // contours.size();

//   // mat.drawContour
//   // mat.drawAllContours
//   // var contours = mat
//   // console.log(contours);
//   // mat.drawContour
//   // mat.save('./pic.jpg')
// })
