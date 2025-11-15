# Kindle Highlighter Shortcuts - Chrome Extension

A Chrome extension that adds keyboard shortcuts to quickly highlight text on Kindle Cloud Reader.

## Features

- ⌨️ **Customizable Keyboard Shortcuts**: Map your preferred key combinations to each highlight color
- 🎨 **Four Highlight Colors**: Yellow, Blue, Pink, and Orange
- ⚡ **Quick Highlighting**: Eliminate multiple clicks - just select and press your shortcut
- 🔧 **Easy Configuration**: User-friendly options page to customize shortcuts
- 📱 **Works on Kindle Cloud Reader**: Compatible with read.amazon.in and read.amazon.com

## Default Shortcuts

- **Yellow**: `Ctrl+Shift+Y` (Mac: `Command+Shift+Y`)
- **Blue**: `Ctrl+Shift+B` (Mac: `Command+Shift+B`)
- **Pink**: `Ctrl+Shift+P` (Mac: `Command+Shift+P`)
- **Orange**: `Ctrl+Shift+O` (Mac: `Command+Shift+O`)

## Installation

### From Source

1. Clone or download this repository
2. Convert SVG icons to PNG format (see below)
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked"
6. Select the extension directory

### Converting Icons (Required)

The extension includes SVG icons that need to be converted to PNG format. You can use any of these methods:

#### Option 1: Online Converter
1. Visit [CloudConvert](https://cloudconvert.com/svg-to-png) or similar service
2. Convert each icon in the `icons/` folder:
   - `icon16.svg` → `icon16.png` (16x16)
   - `icon48.svg` → `icon48.png` (48x48)
   - `icon128.svg` → `icon128.png` (128x128)
3. Save the PNG files back to the `icons/` folder

#### Option 2: Using ImageMagick (if installed)
```bash
cd icons
convert -background none icon16.svg icon16.png
convert -background none icon48.svg icon48.png
convert -background none icon128.svg icon128.png
```

#### Option 3: Using Node.js (svg2png)
```bash
npm install -g svg2png-cli
cd icons
svg2png icon16.svg -o icon16.png -w 16 -h 16
svg2png icon48.svg -o icon48.png -w 48 -h 48
svg2png icon128.svg -o icon128.png -w 128 -h 128
```

## Usage

1. Open a book on Kindle Cloud Reader (read.amazon.in or read.amazon.com)
2. Select any text you want to highlight
3. Press your keyboard shortcut for the desired color
4. The text will be highlighted instantly!

## Customization

1. Click the extension icon in your browser toolbar
2. Click "Customize Shortcuts"
3. Click on any shortcut field and press your desired key combination
4. Click "Save Settings"

You can also customize shortcuts at `chrome://extensions/shortcuts`

## How It Works

The extension:
1. Injects a content script into Kindle Cloud Reader pages
2. Listens for your custom keyboard shortcuts
3. When triggered, finds the appropriate highlight button
4. Simulates a click on that button to highlight your selected text

## Files Structure

```
kindle-highlighter/
├── manifest.json          # Extension configuration
├── content.js            # Content script for Kindle pages
├── background.js         # Background service worker
├── popup.html           # Extension popup UI
├── popup.js             # Popup functionality
├── options.html         # Options page UI
├── options.js           # Options page functionality
└── icons/               # Extension icons
    ├── icon16.svg/png
    ├── icon48.svg/png
    └── icon128.svg/png
```

## Permissions

- `storage`: To save your custom keyboard shortcuts
- `activeTab`: To interact with the current Kindle Cloud Reader tab
- `host_permissions`: Access to read.amazon.in and read.amazon.com

## Troubleshooting

### Shortcuts not working?
- Make sure you're on a Kindle Cloud Reader page (read.amazon.in or read.amazon.com)
- Check that text is selected before pressing the shortcut
- Verify your shortcuts in the options page
- Check for conflicts with other extensions at `chrome://extensions/shortcuts`

### Highlight button not found?
- Make sure the text selection popover is visible
- Try refreshing the Kindle page
- Check browser console for error messages

### Extension not loading?
- Make sure you've converted the SVG icons to PNG format
- Check that all required files are present
- Look for errors in `chrome://extensions/`

## Browser Support

- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## Privacy

This extension:
- Only runs on Kindle Cloud Reader pages
- Does not collect or transmit any data
- Stores shortcuts locally in your browser
- Does not require an internet connection (except for Kindle itself)

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

MIT License - feel free to use and modify as needed.

---

**Enjoy faster highlighting on your Kindle books! 📚✨**
