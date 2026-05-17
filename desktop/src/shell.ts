const TARGET = import.meta.env.VITE_DESKTOP_TARGET ?? "https://app.tonvo.com";
const HEALTH = `${TARGET}/api/health`;
const PROBE_TIMEOUT_MS = 1500;

async function probe(): Promise<boolean> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), PROBE_TIMEOUT_MS);
  try {
    const r = await fetch(HEALTH, { signal: ctrl.signal, cache: "no-store" });
    return r.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

let backoffMs = 3000;

async function boot(): Promise<void> {
  document.body.dataset.state = "booting";
  if (await probe()) {
    window.location.replace(TARGET);
    return;
  }
  document.body.dataset.state = "offline";
  backoffMs = Math.min(backoffMs * 1.5, 30_000);
  setTimeout(boot, backoffMs);
}

document.querySelector(".retry")?.addEventListener("click", () => {
  backoffMs = 3000;
  boot();
});

boot();
