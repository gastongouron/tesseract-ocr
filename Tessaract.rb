class Tesseract < Formula
  desc "OCR (Optical Character Recognition) engine"
  homepage "https://github.com/tesseract-ocr/"
  url "https://osdn.net/frs/g_redir.php?m=netix&f=%2Ftesseract-ocr-alt%2Ftesseract-ocr-3.02.02.tar.gz"
  sha256 "26cd39cb3f2a6f6f1bf4050d1cc0aae35edee49eb49a92df3cb7f9487caa013d"
  revision 3

  bottle do
  revision 1
  sha256 "19d4caa5ce632ca41d3b45accd7f116f6cf93688531f26437cb4833f26cc0172" => :yosemite
  sha256 "092e7e8ccc7622a48a3103d259c9770638fff086438fd5f82661fc80144e4705" => :mavericks
  sha256 "3bac833b02c9927cf4ba9ef43be39ce017f57a5380a076568f79455a836e96e7" => :mountain_lion
end

devel do
  url "https://drive.google.com/uc?id=0B7l10Bj_LprhSGN2bTYwemVRREU&export=download"
  sha256 "d244956236f7491d74d7f342895f611a6c46c45fa9900173d5b7625d8461d2ea"
  version "3.03rc1"

  needs :cxx11
end

head do
  url "https://github.com/tesseract-ocr/tesseract.git"

  depends_on "autoconf" => :build
  depends_on "automake" => :build
  depends_on "libtool" => :build
  depends_on "pkg-config" => :build

  resource "tessdata-head" do
    url "https://github.com/tesseract-ocr/tessdata.git"
  end
end

option "all-languages", "Install recognition data for all languages"

depends_on "libtiff" => :recommended
depends_on "leptonica"

fails_with :llvm do
  build 2206
  cause "Executable 'tesseract' segfaults on 10.6 when compiled with llvm-gcc"
end

# Version 3.02 language packages. Alphabetized by language code.
LANGS = {
  "eng" => "c110029560e7f6d41cb852ca23b66899daa4456d9afeeae9d062204bd271bdf8"
}

LANGS.each do |name, sha|
  resource name do
    url "https://downloads.sourceforge.net/project/tesseract-ocr-alt/tesseract-ocr-3.02.eng.tar.gz?r=https%3A%2F%2Fwww.google.com.mx%2F&ts=1504543264&use_mirror=cytranet"
    version "3.02" # otherwise "ocr" incorrectly detected as the version
    sha256 sha
  end
end

# Tesseract has not released the 3.02 version of the OSD traineddata, so we must download the 3.01 copy
resource "osd" do
  url "https://downloads.sourceforge.net/project/tesseract-ocr-alt/tesseract-ocr-3.01.osd.tar.gz?r=https%3A%2F%2Fwww.google.com.mx%2F&ts=1504543599&use_mirror=svwh"
  version "3.01"
  sha256 "7861210fd0970ad30503e8c70d7841de6716bd293d8512fd8787a1a07219b7aa"
end

def install
  # explicitly state leptonica header location, as the makefile defaults to /usr/local/include,
  # which doesn't work for non-default homebrew location
  ENV["LIBLEPT_HEADERSDIR"] = HOMEBREW_PREFIX/"include"

  ENV.cxx11 if build.devel?

  system "./autogen.sh" if build.head?
  system "./configure", "--disable-dependency-tracking", "--prefix=#{prefix}"
  system "make", "install"
  if build.head?
    resource("tessdata-head").stage { mv Dir["*"], share/"tessdata" }
    elsif build.include? "all-languages"
    resources.each { |r| r.stage { mv Dir["tessdata/*"], share/"tessdata" } }
    else
    resource("eng").stage { mv Dir["tessdata/*"], share/"tessdata" }
    resource("osd").stage { mv Dir["tessdata/*"], share/"tessdata" }
  end
end
end