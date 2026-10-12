# lemón — phone-OS simulator

Vanilla HTML/CSS/JS. No build step: double-click `index.html`.

**Flow:** lock screen → PIN (demo `1234`) → home → apps. Tap the status bar for quick settings.

- Keyboard: digits/Enter on lock screen, digits/Backspace/Esc on PIN screen, Esc closes quick settings.
- Config (PIN, attempts, lockout, carrier, demo hint): `script/data.js`
- Add an app: one line in `script/data.js` (`apps`). Give it a UI in `builders` in `script/home.js` (see Calculator).
- Quick-setting tiles: `tiles` in `script/data.js`.
