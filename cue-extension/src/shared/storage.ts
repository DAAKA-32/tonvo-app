import { type SessionState, DEFAULT_SESSION } from "./types";
import { API_BASE_URL } from "./constants";

export interface ExtensionSettings {
  apiBaseUrl: string;
  widgetPosition: { x: number; y: number };
  widgetExpanded: boolean;
  widgetOpacity: number;
}

const DEFAULT_SETTINGS: ExtensionSettings = {
  apiBaseUrl: API_BASE_URL,
  widgetPosition: { x: -1, y: -1 }, // -1 means auto (bottom-right)
  widgetExpanded: true,
  widgetOpacity: 1,
};

export async function getSettings(): Promise<ExtensionSettings> {
  const data = await chrome.storage.local.get("settings");
  return { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
}

export async function saveSettings(settings: Partial<ExtensionSettings>): Promise<void> {
  const current = await getSettings();
  await chrome.storage.local.set({ settings: { ...current, ...settings } });
}

export async function getSession(): Promise<SessionState> {
  const data = await chrome.storage.local.get("session");
  return { ...DEFAULT_SESSION, ...(data.session || {}) };
}

export async function saveSession(session: Partial<SessionState>): Promise<void> {
  const current = await getSession();
  await chrome.storage.local.set({ session: { ...current, ...session } });
}

export async function clearSession(): Promise<void> {
  await chrome.storage.local.set({ session: DEFAULT_SESSION });
}
