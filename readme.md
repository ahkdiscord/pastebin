# The New AutoHotkey Pastebin

## Project Setup

0.  Clone this repo **with its submodule**.
1.  Install [Bun](https://bun.sh) any way you like
2.  `cd` to the repo root (where `package.json` is)
3.  Install all dependencies with `bun --bun install`

### Development

4.  Copy `.env.example` to `.env.development` and change the variables to something reasonable
5.  Link the submodule with the main project for commit-free updates
    1.  In the submodule, run `bun link`
    2.  In the main project, run `bun link tree-sitter-autohotkey-v2`
6.  Start development server with `bun --bun dev`

### Deployment

4.  Set environment variables either by copying `.env.example` to `.env.production` and modifying it, or by any other means
5.  Build project for production with `bun --bun run build`
6.  Run production server with `bun build/index.js`
