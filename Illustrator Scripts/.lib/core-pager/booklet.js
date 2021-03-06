/**
 * @param {Document} document to attach to, use `document` for active document.
 * @param {Number} start first page to open, the first and default is 0.
 */
function PerfectBoundPager(document, start) {
    var _current = start !== undefined ? start : 0

    this.forEachArtboard = function(action) {
        document.artboards.forEach(function(artboard) {
            artboard.name = _current + 1
            action(artboard, _current++)
        })
    }
}

/**
 * @param {Document} document to attach to, use `document` for active document.
 * @param {Number} start first page to open, the first and default is 0.
 * @param {Number} end final page number, default is artboards' length times 2.
 * @param {Boolean} isRtl useful for arabic layout, default is false.
 */
function SaddleStitchPager(document, start, end, isRtl) {
    var _start = start !== undefined ? start : 0
    var _end = end === undefined ? document.artboards.length * 2 - 1 : end
    var _isRtl = isRtl === undefined ? false : isRtl
    var _isFront = true

    this.forEachArtboard = function(action) {
        document.artboards.forEach(function(artboard) {
            var left, right
            if (_isFront) {
                if (!_isRtl) {
                    left = _end
                    right = _start
                } else {
                    left = _start
                    right = _end
                }
            } else {
                if (!_isRtl) {
                    left = _start
                    right = _end
                } else {
                    left = _end
                    right = _start
                }
            }
            artboard.name = (left + 1) + '-' + (right + 1)
            action(artboard, left, right)
            _start++
            _end--
            _isFront = !_isFront
        })
    }
}