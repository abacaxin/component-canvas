import { useCallback, useEffect, useState } from "react";

const FAV_KEY = "sangre.library.favorites.v1";
const RECENT_KEY = "sangre.library.recents.v1";
const MAX_RECENTS = 6;

function load(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function save(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

/** Favorites + recently-used variant ids for the component library, persisted locally. */
export function useLibraryPrefs() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(load(FAV_KEY));
    setRecents(load(RECENT_KEY));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      save(FAV_KEY, next);
      return next;
    });
  }, []);

  const pushRecent = useCallback((id: string) => {
    setRecents((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX_RECENTS);
      save(RECENT_KEY, next);
      return next;
    });
  }, []);

  return { favorites, toggleFavorite, recents, pushRecent };
}
