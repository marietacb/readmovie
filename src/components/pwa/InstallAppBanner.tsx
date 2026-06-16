"use client";

import { Download, Share, X } from "lucide-react";
import { useEffect, useState } from "react";

const DISMISS_KEY = "diario-install-banner-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallAppBanner() {
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    if (isIos()) {
      setIosHint(true);
      setVisible(true);
      return;
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") dismiss();
    setInstallEvent(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-bj-border bg-bj-navy px-4 py-3 text-bj-cream shadow-lg safe-area-pb">
      <div className="mx-auto flex max-w-3xl items-start gap-3">
        <div className="mt-0.5 shrink-0 rounded-lg bg-bj-terracotta/20 p-2">
          {iosHint ? (
            <Share className="h-5 w-5 text-bj-terracotta" aria-hidden />
          ) : (
            <Download className="h-5 w-5 text-bj-terracotta" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Usar como app en la tablet</p>
          {iosHint ? (
            <p className="mt-0.5 text-sm text-bj-cream/80">
              En Safari: pulsa <strong>Compartir</strong> y luego{" "}
              <strong>Añadir a pantalla de inicio</strong>.
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-bj-cream/80">
              Instálala para abrirla a pantalla completa, como una app nativa.
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!iosHint && installEvent ? (
            <button
              type="button"
              onClick={() => void install()}
              className="rounded-lg bg-bj-terracotta px-3 py-1.5 text-sm font-semibold text-white"
            >
              Instalar
            </button>
          ) : null}
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg p-1.5 text-bj-cream/70 hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
