# Cue Desktop — Manual Smoke Checklist

Run before publishing each release. Phase 1 has no automated end-to-end coverage of the Tauri shell.

## Per-OS install + launch

### Windows 11
- [ ] Download `Cue-Setup.exe` from the release page
- [ ] SmartScreen warns → "More info" → "Run anyway"
- [ ] Installer completes without errors
- [ ] Start menu has "Cue" entry
- [ ] Launching opens a window titled "Cue"
- [ ] Window shows "Starting…" briefly, then loads `app.tonvo.com`
- [ ] Login flow works (Firebase auth completes in the embedded webview)

### macOS 14 (Apple Silicon)
- [ ] Download `Cue.dmg` (aarch64 variant)
- [ ] Drag Cue.app to Applications
- [ ] First launch: right-click → "Open" → "Open" in the dialog (bypasses Gatekeeper)
- [ ] Window appears, loads `app.tonvo.com`

### macOS 14 (Intel)
- [ ] Same as Apple Silicon but downloading the x64 dmg

### Ubuntu 22.04
- [ ] Download `Cue.AppImage`, `chmod +x Cue.AppImage`, run
- [ ] OR install `.deb`: `sudo dpkg -i cue_0.x.x_amd64.deb`
- [ ] Window appears, loads `app.tonvo.com`

## Offline behavior

- [ ] With app running and showing the web UI, disable Wi-Fi → web app shows its own offline state
- [ ] Quit and re-launch with Wi-Fi disabled → desktop shell shows "Cue is offline. Reconnecting…" with retry button
- [ ] Click retry button (no network) → still shows offline (correct)
- [ ] Re-enable Wi-Fi, wait up to ~30s → shell auto-navigates to `app.tonvo.com`

## Auto-update

- [ ] Install version N from the release page
- [ ] Tag and ship version N+1 via `git tag desktop-v0.1.1 && git push --tags`
- [ ] Re-launch installed app → updater prompt appears within 5s of launch
- [ ] Accept update → app restarts on new version

## Release process

1. Bump version in **three** files (they MUST match):
   - `desktop/package.json` → `version`
   - `desktop/src-tauri/tauri.conf.json` → `version`
   - `desktop/src-tauri/Cargo.toml` → `version`
2. Commit: `git commit -am "chore(desktop): bump 0.1.x"`
3. Tag: `git tag desktop-v0.1.x` (the tag MUST match the `version` field)
4. Push: `git push origin master --tags`
5. Wait ~10 min for the matrix build (4 parallel runners + manifest publish)
6. Workflow creates draft release with all artifacts → `publish-manifest` job:
   - Fetches `.sig` files
   - Generates `public/desktop-releases/latest.json`
   - Commits manifest back to `master`
   - Un-drafts the release
7. Vercel auto-deploys → users get the update on next launch

## Local-only dev iteration

For Windows development before pushing tags:

```powershell
cd desktop
$env:TAURI_SIGNING_PRIVATE_KEY = Get-Content updater-private.key -Raw
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = ""
npx tauri build
```

Output: `desktop/src-tauri/target/release/bundle/nsis/Cue_X.X.X_x64-setup.exe`

To run a live dev shell pointed at your local Next.js:

```powershell
# Terminal 1
npm run dev

# Terminal 2
cd desktop
$env:VITE_DESKTOP_TARGET = "http://localhost:3000"
npx tauri dev
```

## What's NOT tested in Phase 1

These are explicit non-goals per the spec — do not add tests for:
- Native audio capture (Phase 3)
- OS keychain token storage (Phase 2)
- Tray icon / global hotkeys (Phase 3)
- Native Stripe checkout (Phase 5)
- Sentry crash reporting (Phase 6)
- OS-level code signing / notarization (Phase 7)
