"use client";

import { BookOpen } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRegistered(false);
    setSubmitting(true);

    const result =
      mode === "login"
        ? await signIn(email, password)
        : await signUp(email, password);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (mode === "register") {
      setRegistered(true);
      setMode("login");
      return;
    }
  };

  return (
    <div className="bj-app-bg fixed inset-0 z-50 flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-bj-border bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-bj-navy to-bj-navy/80">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-bj-navy">
            Diario<span className="font-normal text-bj-muted">.com</span>
          </h1>
          <p className="mt-2 text-sm text-bj-muted">
            {mode === "login"
              ? "Inicia sesión para acceder a tu diario"
              : "Crea tu cuenta para empezar"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-bj-muted">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bj-input w-full"
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-bj-muted">
              Contraseña
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bj-input w-full"
              placeholder="Mínimo 6 caracteres"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          {registered && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              Cuenta creada. Revisa tu email si hace falta confirmarla e inicia sesión.
            </p>
          )}

          <button type="submit" disabled={submitting} className="bj-btn-primary w-full">
            {submitting
              ? "Espera..."
              : mode === "login"
                ? "Iniciar sesión"
                : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-bj-muted">
          {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            type="button"
            className="font-medium text-bj-terracotta hover:underline"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError(null);
              setRegistered(false);
            }}
          >
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
