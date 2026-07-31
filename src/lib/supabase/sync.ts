import { useEffect, useRef, useState } from "react";
import type { ProjectState } from "@/lib/editor/types";
import { supabase } from "./client";

export type SyncStatus = "idle" | "loading" | "saving" | "saved" | "error";

/**
 * Loads the signed-in user's project from Postgres on login and saves changes back
 * (debounced). When Supabase is disabled or nobody is signed in, this is a no-op and
 * the editor keeps using localStorage.
 */
export function useCloudSync({
  userId,
  project,
  onLoad,
}: {
  userId: string | null;
  project: ProjectState;
  onLoad: (state: ProjectState) => void;
}): SyncStatus {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const readyRef = useRef(false);
  const saveTimer = useRef<number | null>(null);

  // Load (or seed) the user's row when they sign in.
  useEffect(() => {
    readyRef.current = false;
    const sb = supabase;
    if (!sb || !userId) {
      setStatus("idle");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    (async () => {
      const { data, error } = await sb
        .from("projects")
        .select("data")
        .eq("owner_id", userId)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setStatus("error");
        return;
      }
      if (data?.data) {
        onLoad(data.data as ProjectState);
      } else {
        // First login: seed the row with whatever the user has locally.
        await sb.from("projects").insert({ owner_id: userId, name: project.name, data: project });
      }
      readyRef.current = true;
      setStatus("saved");
    })();
    return () => {
      cancelled = true;
    };
    // project is intentionally excluded — we only load once per login.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Debounced save on every change, once the initial load has completed.
  useEffect(() => {
    const sb = supabase;
    if (!sb || !userId || !readyRef.current) return;
    setStatus("saving");
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      const { error } = await sb
        .from("projects")
        .upsert(
          { owner_id: userId, name: project.name, data: project },
          { onConflict: "owner_id" },
        );
      setStatus(error ? "error" : "saved");
    }, 800);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [project, userId]);

  return status;
}
