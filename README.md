# OCR-editor

OCR-editor is a tool for editing ALTO files. It is a desktop application writen in Typescript using Electron and React. It allows you to create and maintain projects where you can edit multiple alto files ready for editing

## How to run locally
```
yarn          # install dependencies
yarn start    # start the app
```

## Binaries
Binaries are are available here [releases page](https://github.com/FilipMasar/ocr-editor/releases) (currently only for Mac).
If you are on other platform you can do it by yourself. Just run:

```
yarn          # install dependencies
yarn make     # generate platform specific distributables
```

## Versioning

Do following steps when updating to new version:

1. Update version number in [`package.json`](./package.json)
2. Run following commands (replace `0.0.0` with correct version number):
   ```
   git add -A
   git commit -m "New version 0.0.0"
   git tag v0.0.0
   git push origin v0.0.0
   ```
3. Github action will automatically create a new draft release with binaries for all platforms
4. Publish the release