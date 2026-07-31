import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./client";

export interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

/** Tracks the current Supabase auth session. In local-only mode it resolves to signed-out. */
export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, loading };
}

export async function signInWithPassword(email: string, password: string) {
  if (!supabase) throw new Error("Supabase não configurado");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpWithPassword(email: string, password: string) {
  if (!supabase) throw new Error("Supabase não configurado");
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  // When email confirmation is enabled, there is no session until the user confirms.
  return { needsConfirmation: !data.session };
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
