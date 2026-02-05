# The New AutoHotkey Pastebin

## Project Setup

1.  Install [Bun](https://bun.sh) any way you like
2.  `cd` to the repo root (where `package.json` is)
3.  Install all dependencies with `bun install`

### Development

4.  Copy `.env.example` to `.env.development` and change the variables to something reasonable
5.  Start development server with `bun dev`

### Deployment

4.  Set environment variables either by copying `.env.example` to `.env.production` and modifying it, or by any other means
5.  Build project for production with `bun run build`
6.  Run production server with `bun build/index.js`
