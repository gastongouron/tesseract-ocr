require 'rtesseract'

[0,1,2,3,4,5,6,7,8,9,10].each do |v|
  name = "./crop/"+v.to_s+"cropped.png"

  image = RTesseract.new(name, :lang => "fra")
  puts image.to_s.gsub /^$\n/, ''
end