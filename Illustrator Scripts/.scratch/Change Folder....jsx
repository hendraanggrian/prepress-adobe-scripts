// Relink all selected PlacedItem with the same file name to different folder.
// Only tested on images, not documents.

#target Illustrator
#include '../.lib/commons.js'
#include '../.lib/ui/checks.js'

checkHasSelection()

var items = selection.filterItem(function(it) { return it.typename === 'PlacedItem' })
check(items.isNotEmpty(), 'No links found in selection')

var dialog = new Dialog('Relink Change Folder', 'fill')
var maintainGroup

var folder = openFolder(dialog.title)

if (folder != null) {
    maintainGroup = new MaintainDimensionGroup(dialog.main)

    dialog.setNegativeButton('Cancel')
    dialog.setPositiveButton(function() {
        items.forEach(function(item) {
            var width = item.width
            var height = item.height
            var position = item.position
            item.relink(folder.getFiles()
                .filter(function(file) { return file.name === item.file.name })
                .first())
            if (maintainGroup.isMaintain()) {
                item.width = width
                item.height = height
                item.position = position
            }
        })
    })
    dialog.show()
}