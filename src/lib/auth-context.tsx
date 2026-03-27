"use client";

import { createContext, useContext, useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import { auth, onAuthStateChanged, type User } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  /** Returns a promise that resolves with the user once auth state is settled. */
  waitForUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, waitForUser: () => Promise.resolve(null) });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef<User | null>(null);
  const readyRef = useRef(false);
  const waitersRef = useRef<((u: User | null) => void)[]>([]);

  useEffect(() => {
    if (!auth) {
      readyRef.current = true;
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      userRef.current = u;
      setUser(u);
      setLoading(false);
      readyRef.current = true;
      // Flush all pending waiters
      const pending = waitersRef.current.splice(0);
      for (const resolve of pending) resolve(u);
    });
    return unsubscribe;
  }, []);

  const waitForUser = useCallback((): Promise<User | null> => {
    // If auth state is already settled AND we have a current user, resolve immediately
    if (readyRef.current && userRef.current) return Promise.resolve(userRef.current);
    // Otherwise wait for the next onAuthStateChanged
    return new Promise((resolve) => {
      // Check again (might have resolved between the check and creating the promise)
      if (userRef.current) { resolve(userRef.current); return; }
      waitersRef.current.push(resolve);
      // Safety timeout — never hang forever
      setTimeout(() => resolve(userRef.current), 3000);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, waitForUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
