ENV['CFLAGS'] = '-I/usr/local/Cellar/tesseract/3.05.01/include -I/usr/local/Cellar/leptonica/1.74.4_1/include'
ENV['LDFLAGS'] = '-L/usr/local/Cellar/tesseract/3.05.01/lib -L/usr/local/Cellar/leptonica/1.74.4_1/lib'
require 'tesseract'

e = Tesseract::Engine.new {|e|
  e.language  = :eng
  e.blacklist = '|'
}

e.text_for('test/first.png').strip

# puts e.text_for('abc.png').strip