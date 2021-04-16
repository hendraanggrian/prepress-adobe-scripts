function ImposePanel(parent, textBounds, editBounds) {
    var self = this
    this.main = parent.addVPanel('Impose Options')

    this.units = this.main.addHGroup()
    this.units.addText(textBounds, 'Units:', 'right')
    this.unitsList = this.units.addDropDown(editBounds, UNITS)
    this.unitsList.selection = UNITS.indexOf('Millimeters')
    this.units.setTooltip('Ruler units for the new document.')

    this.pages = this.main.addHGroup()
    this.pages.addText(textBounds, 'Pages:', 'right')
    this.pagesEdit = this.pages.addEditText(editBounds, '4')
    this.pagesEdit.validateDigits()
    this.pagesEdit.active = true
    this.pages.setTooltip('Number of pages.')

    this.width = this.main.addHGroup()
    this.width.addText(textBounds, 'Width:', 'right')
    this.widthEdit = this.width.addEditText(editBounds, '210 mm')
    this.widthEdit.validateUnits()

    this.height = this.main.addHGroup()
    this.height.addText(textBounds, 'Height:', 'right')
    this.heightEdit = this.height.addEditText(editBounds, '297 mm')
    this.heightEdit.validateUnits()

    this.getUnits = function() {
        return parseRulerUnits(self.unitsList.selection.text)
    }

    this.getPages = function() {
        return parseUnits(self.pagesEdit.text)
    }

    this.getWidth = function() {
        return parseUnits(self.widthEdit.text)
    }

    this.getHeight = function() {
        return parseUnits(self.heightEdit.text)
    }

    /**
     * @param {String} title default new document name, may be null.
     * @param {Number} bleed area around artboard, may be null.
     * @returns 
     */
    this.getDocumentPreset = function(title, bleed) {
        var preset = new DocumentPreset()
        if (title !== undefined) {
            preset.title = title
        }
        preset.units = self.getUnits()
        preset.width = self.getWidth() * 2
        preset.height = self.getHeight()
        preset.numArtboards = self.getPages() / 2
        preset.rasterResolution = DocumentRasterResolution.HighResolution
        if (bleed !== undefined && bleed > 0) {
            preset.documentBleedLink = true
            preset.documentBleedOffset = [bleed, bleed, bleed, bleed]
        }
        return preset
    }
}