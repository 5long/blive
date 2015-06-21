#!/usr/bin/env node

require("shelljs/make")

target.css = function() {
  cp("-f", "node_modules/purecss/build/pure.css", "ui/css/vendor/pure.css")
  cp("-f", "node_modules/font-awesome/css/font-awesome.css", "ui/css/vendor/font-awesome.css")
  cp("-fr", "node_modules/font-awesome/fonts/", "ui/css/fonts/")
}
