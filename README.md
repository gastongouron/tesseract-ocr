### Prerequisite (osx)

```
brew install tesseract --all-languages

brew install Leptonica

brew install imagemagick@6 && brew link imagemagick@6 --force

brew install opencv@2

brew unlink opencv@2

brew link --overwrite opencv@2 --force

PKG_CONFIG_PATH="/usr/local/Cellar/opencv@2/2.4.13.2_2/lib/pkgconfig/"

rm -rf node_modules (yes, really D:)

npm install opencv
```

Get options with
```
Tesseract --help
```

Run with node options
```
--no-deprecation --no-warnings t.js`
```

Todo:

http://coding-robin.de/2013/07/22/train-your-own-opencv-haar-classifier.html

QA

http://answers.opencv.org/question/177011/training-haar-classifier-to-detect-each-book-on-a-bookshelf/