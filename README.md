# OCR-editor

OCR-editor is a tool for editing ALTO files. It is a web-based application that allows users to easily view and edit ALTO files.

## How to run locally
```
yarn         # install dependencies
yarn start   # start dev server
```

## Usage
App is devided into 2 pars:
 - Viewer - on the left
 - Panel - on the right

**Viewer** is used for displaying elements and text from alto over the image. Right now it supports following elements:
 - PrintSpace
 - Illustration
 - GraphicalElement
 - TextBlock
 - TextLine
 - String

 Also there is an option to view text on top of the text from image (`Text fit` option in panel) or above the lines (`Text above` option in panel)

**Panel** offers following
 - choose alto xml and jpeg file
 - open Alto Editor (it allows to edit whole alto file as an json object), open Text Editor (it allows to edit text that was found in alto)
 - set zoom of the viewer and opacity of the image
 - font settings - it displays TextStyle from alto. You can update font size and pick a color so you can see on which Strings that particular font is applied
 - options do display chosen elements
 - export updated xml