Conversion to .ico for Windows builds

Electron-builder on Windows expects an .ico file for the application icon. To convert the provided SVG to ICO, you can use one of the following methods:

1) Using ImageMagick (if installed):

```powershell
magick convert assets\icon.svg -resize 256x256 assets\icon.png
magick convert assets\icon.png assets\icon.ico
```

2) Using npm package `png-to-ico` (from project root):

```powershell
npm install --save-dev png-to-ico
npx png-to-ico assets\icon.png > build\icon.ico
```

3) Using `icotool` / online converters: export a 256x256 PNG and convert via any online ICO converter.

After you have `build\icon.ico`, set the icon in `package.json` under `build` (optional):

```
"build": {
  "icon": "build/icon.ico",
  ...
}
```

Then run `npm run build` to create the installer. The final EXE will be in the `dist` folder.
