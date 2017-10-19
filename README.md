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

Run with `node t.js`