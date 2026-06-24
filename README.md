# MD-Vi

A cross-platform desktop Markdown viewer built with Tauri 2. Lightweight, fast, and native — runs on Windows and macOS.

## Features

- **Open Markdown files** — via the Open File button, `Ctrl+O` / `Cmd+O`, or drag-and-drop
- **Full GFM rendering** — headings, bold, italic, lists, code blocks, tables, blockquotes, checkboxes, images, and more
- **Dark mode** — automatically follows your system theme
- **File associations** — right-click any `.md` file → Open with → MD-Vi (after installation)
- **Lightweight** — no Electron overhead; powered by Tauri and your system's WebView

## Install

### Windows

Download the MSI or NSIS installer from the latest release:

```
src-tauri/target/release/bundle/msi/MD-Vi_0.1.0_x64_en-US.msi
src-tauri/target/release/bundle/nsis/MD-Vi_0.1.0_x64-setup.exe
```

After installation, `.md` and `.markdown` files will be registered for "Open with".

### macOS

Build from source on macOS (see below), or download the `.dmg` from the latest release.

## Build from source

### Prerequisites

- [Rust](https://rustup.rs/)
- [Node.js](https://nodejs.org/) (v18+)
- [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for your platform

### Steps

```bash
# Clone or enter the project directory
cd md-viewer

# Install frontend dependencies
npm install

# Generate app icons (from SVG)
node scripts/generate-icons.mjs

# Build for production
npm run tauri build
```

The built binary will be at `src-tauri/target/release/md-viewer` (or `md-viewer.exe` on Windows).

### Development

```bash
npm run tauri dev
```

## Usage

| Action | Method |
|--------|--------|
| Open file | Click **Open File** or press `Ctrl+O` |
| Open via drag-drop | Drag a `.md` file onto the window |
| Open with MD-Vi (file manager) | Right-click a `.md` file → Open with → MD-Vi |
| Replace current file | Drop a new file or use Open File again |

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Markdown parsing:** [marked](https://marked.js.org/) (via CDN)
- **Backend:** Rust + [Tauri 2](https://v2.tauri.app/)
- **Icons:** Custom SVG → sharp-generated PNG/ICO/ICNS

## License

MIT
