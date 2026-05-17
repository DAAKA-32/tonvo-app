# Tonvo Desktop — Manual Smoke Checklist

Run before publishing each release. Phase 1 has no automated end-to-end coverage of the Tauri shell.

## Per-OS install + launch

### Windows 11
- [ ] Download `Tonvo-Setup.exe` from the release page
- [ ] SmartScreen warns → "More info" → "Run anyway"
- [ ] Installer completes without errors
- [ ] Start menu has "Tonvo" entry
- [ ] Launching opens a window titled "Tonvo"
- [ ] Window shows "Starting…" briefly, then loads `app.tonvo.com`
- [ ] Login flow works (Firebase auth completes in the embedded webview)

### macOS 14 (Apple Silicon)
- [ ] Download `Tonvo-aarch64.dmg`
- [ ] Drag Tonvo.app to Applications
- [ ] First launch: right-click → "Open" → "Open" in the dialog (bypasses Gatekeeper)
- [ ] Window appears, loads `app.tonvo.com`

### macOS 14 (Intel)
- [ ] Same as Apple Silicon but downloading `Tonvo-x64.dmg`

### Ubuntu 22.04
- [ ] Download `Tonvo.AppImage`, `chmod +x Tonvo.AppImage`, run
- [ ] OR install `.deb`: `sudo dpkg -i tonvo.deb`
- [ ] Window appears, loads `app.tonvo.com`

## Offline behavior

- [ ] With app running and showing the web UI, disable Wi-Fi → web app shows its own offline state
- [ ] Quit and re-launch with Wi-Fi disabled → desktop shell shows "Tonvo is offline. Reconnecting…" with retry button
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
8. **Post-release: submit `Tonvo-Setup.exe` to Microsoft for SmartScreen whitelisting** (see next section)

## Post-release: Microsoft Defender / SmartScreen submission

Phase 1 binaries are not OS-signed, so Windows SmartScreen warns users on first launch ("Windows protected your PC"). Microsoft can whitelist each release's specific file hash after a free scan. This is the cheapest path to clean installs until Phase 7 (proper code signing certificate).

**Time required:** ~2 minutes per release. **Delay before warning disappears:** 1-3 days.

### Per-release checklist

1. **Download the just-published `Tonvo-Setup.exe`** from the release page:
   `https://github.com/DAAKA-32/cue-desktop/releases/latest`
2. **Open the Microsoft submission form:**
   👉 https://www.microsoft.com/en-us/wdsi/filesubmission
3. **Sign in** with a Microsoft account (any free MSA works). Use a single shared account so submissions accumulate reputation under one identity.
4. **Fill the form:**
   | Field | Value |
   |---|---|
   | What is the file you want to submit | Choose `Tonvo-Setup.exe` |
   | What do you believe this file is | **Incorrectly detected as malware/malicious** |
   | Defender version | Use the prefilled value (or `1.x.xxxxx.x` from Windows Security) |
   | Detection name | Leave blank if not flagged by name, otherwise paste the exact name |
   | Detected on | Today's date |
   | Additional information | "Tonvo is a Tauri 2 desktop application (AI sales copilot). The binary is built via GitHub Actions in https://github.com/DAAKA-32/tonvo-app/actions and published unsigned. Phase 1 release — OS-level code signing coming later. Source: https://app.tonvo.com" |
   | Files | Drag the downloaded `Tonvo-Setup.exe` |
5. **Submit.** You'll get a tracking ID.
6. **Wait 1-3 days.** Microsoft scans, confirms clean, adds hash to whitelist. SmartScreen stops warning for that exact binary.

### Important notes

- **Hash-specific whitelist.** Each release's `Tonvo-Setup.exe` has a different SHA256, so Microsoft must whitelist each one separately. Do this for every `desktop-v*` release.
- **In the meantime,** users see the SmartScreen warning. Workaround: "More info" → "Run anyway". Document this in the release notes.
- **Track submissions** in a doc / spreadsheet (version → submission date → status). Microsoft sends an email when the verdict is in.
- **If Microsoft flags as malicious,** they'll respond explaining why. Most common false positive triggers for unsigned Rust binaries: heuristic detection of WebView2 bootstrapper, single-instance plugin's named pipes. Reply with details, usually resolved within a week.

### Reputation strategy

Independent of per-release submission, SmartScreen also accumulates **organic reputation** based on download count and absence of complaints. After several thousand installs of releases without issues, even un-submitted future releases tend to be flagged less aggressively. The "per-release submission" approach speeds this up — Microsoft attaches reputation to the publisher identity (signed by your MSA), not just the file hash.

### When to graduate to code signing (Phase 7)

Move to Azure Trusted Signing (~$10/month) or an EV certificate ($300+/year) when **any** of these is true:
- You're shipping more than 2 releases per week (manual submission too tedious)
- You're paying for paid ads driving installs (SmartScreen lost-install rate becomes material)
- A B2B prospect blocks installs at the firewall/EDR level (some EDRs aggressively block unsigned binaries regardless of SmartScreen)

Azure Trusted Signing is the recommended Phase 7 path — Microsoft signs via their own CA chain, immediate SmartScreen acceptance, and the workflow integration is a 2-env-var change in `.github/workflows/desktop-release.yml`.

## Local-only dev iteration

For Windows development before pushing tags:

```powershell
cd desktop
$env:TAURI_SIGNING_PRIVATE_KEY = Get-Content updater-private.key -Raw
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = ""
npx tauri build
```

Output: `desktop/src-tauri/target/release/bundle/nsis/Tonvo_X.X.X_x64-setup.exe`

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
