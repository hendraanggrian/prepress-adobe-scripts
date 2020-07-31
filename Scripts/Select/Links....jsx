/**
 * Select all PlacedItem with attributes matching user input.
 * When there are active selection, will only select items within those selection.
 */

#target Illustrator
#include '../.lib/colors.js'
#include '../.lib/preconditions.js'
#include '../.lib/select.js'
#include '../.lib/units.js'

const FILE_AI = ['ai']
const FILE_PDF = ['pdf']
const FILE_BMP = ['bmp']
const FILE_GIF = ['gif']
const FILE_JPEG = ['jpg', 'jpe', 'jpeg']
const FILE_JPEG2000 = ['jpf', 'jpx', 'jp2', 'j2k', 'j2c', 'jpc']
const FILE_PNG = ['png', 'pns']
const FILE_PSD = ['psd', 'psb', 'pdd']
const FILE_TIFF = ['tif', 'tiff']

const BOUNDS_DIMENSION_TEXT = [0, 0, 45, 21]
const BOUNDS_DIMENSION_EDIT = [0, 0, 100, 21]
const BOUNDS_COLOR_TEXT = [0, 0, 45, 21]

checkActiveDocument()

var document = app.activeDocument
var selection = document.selection

var dialog = new Window('dialog', 'Select links')

dialog.main = dialog.add('group')
dialog.buttons = dialog.add('group')

dialog.main.alignChildren = 'fill'
dialog.dimension = dialog.main.add('panel', undefined, 'Dimension')
dialog.file = dialog.main.add('panel', undefined, 'File types')

dialog.dimension.add('group')
dialog.dimension.width = dialog.dimension.add('group')
dialog.dimension.width.add('statictext', BOUNDS_DIMENSION_TEXT, 'Width:').justify = 'right'
var widthEdit = dialog.dimension.width.add('edittext', BOUNDS_DIMENSION_EDIT)
widthEdit.active = true
dialog.dimension.height = dialog.dimension.add('group')
dialog.dimension.height.add('statictext', BOUNDS_DIMENSION_TEXT, 'Height:').justify = 'right'
var heightEdit = dialog.dimension.height.add('edittext', BOUNDS_DIMENSION_EDIT)

dialog.file.alignChildren = 'fill'
dialog.file.add('group')
var aiCheck = dialog.file.add('checkbox', undefined, getTypeString('Adobe Illustrator', FILE_AI))
var pdfCheck = dialog.file.add('checkbox', undefined, getTypeString('Adobe PDF', FILE_PDF))
var bmpCheck = dialog.file.add('checkbox', undefined, getTypeString('BMP', FILE_BMP))
var gifCheck = dialog.file.add('checkbox', undefined, getTypeString('GIF89a', FILE_GIF))
var jpegCheck = dialog.file.add('checkbox', undefined, getTypeString('JPEG', FILE_JPEG))
var jpeg2000Check = dialog.file.add('checkbox', undefined, getTypeString('JPEG2000', FILE_JPEG2000))
var pngCheck = dialog.file.add('checkbox', undefined, getTypeString('PNG', FILE_PNG))
var psdCheck = dialog.file.add('checkbox', undefined, getTypeString('Photoshop', FILE_PSD))
var tiffCheck = dialog.file.add('checkbox', undefined, getTypeString('TIFF', FILE_TIFF))

dialog.buttons.alignment = 'right'
dialog.buttons.add('button', undefined, 'Cancel')
dialog.buttons.add('button', undefined, 'OK').onClick = function() {
    dialog.close()

    selectItems([SELECT_PLACED], function(item) {
        var extension = item.file.name.split('.').pop()
        var condition = true
        
        var width = parseUnit(widthEdit.text)
        if (width > 0) {
            condition = condition && parseInt(width) == parseInt(item.width)
        }
        var height = parseUnit(heightEdit.text)
        if (height > 0) {
            condition = condition && parseInt(height) == parseInt(item.height)
        }
        if (aiCheck.value) {
            condition = condition && contains(FILE_AI, extension)
        }
        if (pdfCheck.value) {
            condition = condition && contains(FILE_PDF, extension)
        }
        if (bmpCheck.value) {
            condition = condition && contains(FILE_BMP, extension)
        }
        if (gifCheck.value) {
            condition = condition && contains(FILE_GIF, extension)
        }
        if (jpegCheck.value) {
            condition = condition && contains(FILE_JPEG, extension)
        }
        if (jpeg2000Check.value) {
            condition = condition && contains(FILE_JPEG2000, extension)
        }
        if (pngCheck.value) {
            condition = condition && contains(FILE_PNG, extension)
        }
        if (psdCheck.value) {
            condition = condition && contains(FILE_PSD, extension)
        }
        if (tiffCheck.value) {
            condition = condition && contains(FILE_TIFF, extension)
        }

        return condition
    })
}

dialog.show()

function getTypeString(prefix, suffix) {
    var s = ''
    for (var i = 0; i < suffix.length; i++) {
        s += suffix[i]
        if (i != suffix.length - 1) {
            s += ', '
        }
    }
    return prefix + ' (' + s + ')'
}

function contains(elements, element) {
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].toLowerCase() == element) {
            return true
        }
    }
    return false
}