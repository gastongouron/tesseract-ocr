brew install tesseract --all-languages
brew install Leptonica
mogrify -density 300x300 -units PixelsPerInch abc.png
tesseract -l eng abc.png output -psm 7

sometimes:
brew install imagemagick@6 && brew link imagemagick@6 --force

gem= install chunky png

TODO:
-> take panorama
-> rotate 90%
-> make confirm its reading side
-> analyze image and split each block of color into a square image
-> for each image, use ocr to get text data
-> try both sides for each image to get meaningful data
-> store data into an array
-> render data through api :)




About node opencv:
brew install opencv@2
brew unlink opencv@2
brew link --overwrite opencv@2 --force
PKG_CONFIG_PATH="/usr/local/Cellar/opencv@2/2.4.13.2_2/lib/pkgconfig/"
rm -rf node_modules
npm install opencv