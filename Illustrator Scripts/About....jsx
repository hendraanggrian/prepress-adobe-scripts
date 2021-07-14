#target Illustrator
#include '../.stdlib/ui/about.js'
#include '.lib/core.js'

var dialog = new Dialog('About')
dialog.vgroup(function(main) {
    main.hgroup(function(group) {
        group.alignChildren = 'center'
        group.image(undefined, getResource('logo.png'))
        group.staticText([300, 32], 'Prepress Adobe Scripts for Illustrator\nVersion 0.0', undefined, { multiline: true })
    })
    new AboutTabbedPanel(main)
})
dialog.setNegativeButton('Close')
dialog.setNeutralButton(230, 'Visit GitHub', function() {
    openURL('https://github.com/hendraanggrian/prepress-adobe-scripts')
})
dialog.show()