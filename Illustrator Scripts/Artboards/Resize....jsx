#target Illustrator
#include '../.lib/commons.js'

var BOUNDS_TEXT = [70, 21]
var BOUNDS_EDIT = [100, 21]

var dialog = new Dialog('Resize Artboards')
var rangeGroup, widthEdit, heightEdit, anchorGroup
var fitToArtsCheck

dialog.vgroup(function(main) {
    main.alignChildren = 'right'
    main.hgroup(function(topGroup) {
        topGroup.alignChildren = 'fill'
        topGroup.vpanel('Artboard', function(panel) {
            panel.hgroup(function(group) {
                group.tips('Which artboards to resize')
                group.staticText(BOUNDS_TEXT, 'Artboards:').also(JUSTIFY_RIGHT)
                rangeGroup = new RangeGroup(group, BOUNDS_EDIT).also(function(it) {
                    it.maxRange = document.artboards.length
                    it.endEdit.text = document.artboards.length
                })
            })
            panel.hgroup(function(group) {
                group.tips("Artboards' new width")
                group.staticText(BOUNDS_TEXT, 'Width:').also(JUSTIFY_RIGHT)
                widthEdit = group.editText(BOUNDS_EDIT, formatUnits(document.width, unitName, 2)).also(function(it) {
                    it.validateUnits()
                    it.activate()
                })
            })
            panel.hgroup(function(group) {
                group.tips("Artboards' new height")
                group.staticText(BOUNDS_TEXT, 'Height:').also(JUSTIFY_RIGHT)
                heightEdit = group.editText(BOUNDS_EDIT, formatUnits(document.height, unitName, 2)).also(VALIDATE_UNITS)
            })
        })
        topGroup.vpanel('Anchor', function(panel) {
            anchorGroup = new AnchorGroup(panel)
        })
    })
    fitToArtsCheck = main.checkBox(undefined, 'Fit to Arts').also(function(it) {
        it.tip("Wrap artboards' sizes to each arts")
        it.onClick = function() {
            widthEdit.enabled = !it.value
            heightEdit.enabled = !it.value
            anchorGroup.main.enabled = !it.value
        }
    })
})
dialog.setNegativeButton('Cancel')
dialog.setPositiveButton(function() {
    var w = parseUnits(widthEdit.text)
    var h = parseUnits(heightEdit.text)
    if (w > 0 && h > 0) {
        rangeGroup.forEach(function(i) {
            if (fitToArtsCheck.value) {
                document.artboards.setActiveArtboardIndex(i)
                document.selectObjectsOnActiveArtboard(i)
                document.fitArtboardToSelectedArt(i)
            } else {
                resizeArtboard(i, w, h)
            }
        })
    }
})
dialog.show()

// Customized from https://github.com/iconifyit/ai-scripts/blob/master/Resize%20All%20Artboards.jsx.
function resizeArtboard(i, w, h) {
    var artboard = document.artboards[i]
    var bounds = artboard.artboardRect

    var ctrx, ctry
    if (anchorGroup.isVerticalLeft()) {
        ctrx = bounds.getLeft()
    } else if (anchorGroup.isVerticalCenter()) {
        ctrx = bounds.getWidth() / 2 + bounds.getLeft()
    } else {
        ctrx = bounds.getWidth() + bounds.getLeft()
    }
    if (anchorGroup.isHorizontalTop()) {
        ctry = bounds.getTop()
    } else if (anchorGroup.isHorizontalCenter()) {
        ctry = bounds.getTop() - bounds.getHeight() / 2
    } else {
        ctry = bounds.getTop() - bounds.getHeight()
    }

    var newLeft, newTop, newRight, newBottom
    if (anchorGroup.isVerticalLeft()) {
        newLeft = bounds.getLeft()
        newRight = ctrx + w
    } else if (anchorGroup.isVerticalCenter()) {
        newLeft = ctrx - w / 2
        newRight  = ctrx + w / 2
    } else {
        newLeft = ctrx - w
        newRight = bounds.getRight()
    }
    if (anchorGroup.isHorizontalTop()) {
        newTop = bounds.getTop()
        newBottom = ctry - h
    } else if (anchorGroup.isHorizontalCenter()) {
        newTop = ctry + h / 2
        newBottom = ctry - h / 2
    } else {
        newTop = ctry + h
        newBottom = bounds.getBottom()
    }
    var rect = [newLeft, newTop, newRight, newBottom]
    $.writeln(i + '. ' + 'ctry=' + ctrx + ' ctry=' + ctry + ' rect=[' + rect + ']')
    artboard.artboardRect = rect
}