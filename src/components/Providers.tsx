"use client";

import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/Toast";
import I18nProvider from "@/i18n/I18nProvider";
import DynamicTitle from "@/components/DynamicTitle";
import { PerformanceProvider } from "@/lib/performance";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PerformanceProvider>
      <I18nProvider>
        <DynamicTitle />
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </I18nProvider>
    </PerformanceProvider>
  );
}
