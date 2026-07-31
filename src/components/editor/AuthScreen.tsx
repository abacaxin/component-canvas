import { useState } from "react";
import { signInWithPassword, signUpWithPassword } from "@/lib/supabase/auth";
import { Sparkles, Loader2 } from "lucide-react";

export function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "login") {
        await signInWithPassword(email.trim(), password);
      } else {
        const { needsConfirmation } = await signUpWithPassword(email.trim(), password);
        if (needsConfirmation) {
          setInfo("Conta criada. Confirme pelo e-mail que enviamos para entrar.");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado. Tente novamente.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg,#3D0000,#950101,#FF0000)",
              boxShadow: "0 0 30px -6px #FF0000",
            }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="text-xl font-semibold font-display">SANGRE</div>
          <div className="text-sm text-muted-foreground mt-1">
            {mode === "login" ? "Entre para acessar seus sites" : "Crie sua conta"}
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            className="w-full text-sm bg-input/60 border border-border rounded-lg px-3 py-2.5 outline-none focus:border-[#950101] focus:ring-2 focus:ring-[#FF0000]/20 transition-all"
          />
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha (mín. 6 caracteres)"
            className="w-full text-sm bg-input/60 border border-border rounded-lg px-3 py-2.5 outline-none focus:border-[#950101] focus:ring-2 focus:ring-[#FF0000]/20 transition-all"
          />

          {error && (
            <div className="text-xs text-[#FF6B6B] bg-[#3D0000]/40 border border-[#950101]/50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {info && (
            <div className="text-xs text-white/80 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full h-10 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            style={{
              background: "linear-gradient(135deg,#3D0000,#950101,#FF0000)",
              boxShadow: "0 0 24px -8px #FF0000",
            }}
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode((m) => (m === "login" ? "signup" : "login"));
            setError(null);
            setInfo(null);
          }}
          className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {mode === "login" ? "Não tem conta? Criar uma" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
}
