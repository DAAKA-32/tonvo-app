import type { AuthError } from "firebase/auth";

/**
 * Maps a Firebase AuthError (or generic Error) to an i18n translation key.
 * All keys live under the "auth" namespace in locale files.
 */

const FIREBASE_CODE_MAP: Record<string, string> = {
  "auth/invalid-email":                        "auth.invalidEmail",
  "auth/user-disabled":                        "auth.userDisabled",
  "auth/user-not-found":                       "auth.invalidCredentials",
  "auth/wrong-password":                       "auth.invalidCredentials",
  "auth/invalid-credential":                   "auth.invalidCredentials",
  "auth/invalid-login-credentials":            "auth.invalidCredentials",
  "auth/email-already-in-use":                 "auth.emailInUse",
  "auth/weak-password":                        "auth.weakPassword",
  "auth/too-many-requests":                    "auth.tooManyRequests",
  "auth/network-request-failed":               "auth.networkError",
  "auth/popup-closed-by-user":                 "auth.popupClosed",
  "auth/popup-blocked":                        "auth.popupBlocked",
  "auth/account-exists-with-different-credential": "auth.accountExistsDifferentProvider",
  "auth/operation-not-allowed":                "auth.operationNotAllowed",
  "auth/requires-recent-login":                "auth.requiresRecentLogin",
  "auth/credential-already-in-use":            "auth.credentialInUse",
};

/**
 * Returns the i18n key for a given error.
 * Usage: `t(getAuthErrorKey(err))`
 */
export function getAuthErrorKey(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as AuthError).code;
    return FIREBASE_CODE_MAP[code] ?? "auth.genericError";
  }
  return "auth.genericError";
}
