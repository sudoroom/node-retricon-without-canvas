var ndarray = require('ndarray')
var savePixels = require('save-pixels')
var Color = require('color')
var ops = require('ndarray-ops')
var concat = require('concat-stream')

module.exports = function createFakeCanvas(w, h) {
  var pixels = ndarray(new Uint8Array(w * h * 4), [w, h, 4])
  return {
    fillStyle: 'rgba(0,0,0,0)',
    fillRect: function(x, y, w_, h_) {
      if(x < 0) {
        w_ -= x
      }
      if(y < 0) {
        h_ -= y
      }
      x = Math.max(Math.min(x, w), 0)
      y = Math.max(Math.min(y, h), 0)
      w_ = Math.max(Math.min(w_, w), 0)
      h_ = Math.max(Math.min(h_, h), 0)
      var c = Color(this.fillStyle).rgb().array()
      c[3] = 255;
      var range = pixels.lo(x, y).hi(w_, h_)
      for(var i=0; i<4; ++i) {
        ops.assigns(range.pick(null, null, i), c[i])
      }
    },
    pngStream: function() {
      return savePixels(pixels, 'png')
    },
  }
}
