brew install tesseract --all-languages
brew install Leptonica
mogrify -density 300x300 -units PixelsPerInch abc.png
tesseract -l eng abc.png output -psm 7