import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectState, PropValue, Typography } from "./types";
import { createInstance, cloneProps, getVariant } from "./sections";
import { DEFAULT_TYPOGRAPHY } from "./typography";

const STORAGE_KEY = "sangre.project.v2";
const MAX_HISTORY = 50;

function initialProject(): ProjectState {
  return {
    name: "Meu site",
    typography: { ...DEFAULT_TYPOGRAPHY },
    sections: [
      createInstance("navbar.modern"),
      createInstance("hero.gradient"),
      createInstance("features.grid"),
      createInstance("testimonials.cards"),
      createInstance("cta.banner"),
      createInstance("footer.dark"),
    ],
  };
}

/** Tolerate older/partial saved shapes so a load never crashes the editor. */
function normalize(raw: unknown): ProjectState {
  const base = initialProject();
  if (!raw || typeof raw !== "object") return base;
  const p = raw as Partial<ProjectState>;
  return {
    name: typeof p.name === "string" ? p.name : base.name,
    typography: { ...DEFAULT_TYPOGRAPHY, ...(p.typography ?? {}) },
    sections: Array.isArray(p.sections)
      ? p.sections.filter((s) => getVariant(s.variantId))
      : base.sections,
  };
}

/** Generate a new list item from the variant's declared item defaults. */
function newListItem(variantId: string, key: string) {
  const field = getVariant(variantId)?.schema.find((f) => f.key === key);
  return { _id: crypto.randomUUID(), ...(field?.itemDefaults ?? {}) };
}

export function useProject() {
  const [project, setProject] = useState<ProjectState>(initialProject);
  const [hydrated, setHydrated] = useState(false);
  const history = useRef<ProjectState[]>([]);
  const future = useRef<ProjectState[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProject(normalize(JSON.parse(raw)));
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  // Autosave
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [project, hydrated]);

  const commit = useCallback((updater: (prev: ProjectState) => ProjectState) => {
    setProject((prev) => {
      history.current.push(prev);
      if (history.current.length > MAX_HISTORY) history.current.shift();
      future.current = [];
      return updater(prev);
    });
  }, []);

  const addSection = useCallback(
    (variantId: string, atIndex?: number) => {
      commit((p) => {
        const inst = createInstance(variantId);
        const sections = [...p.sections];
        if (atIndex === undefined) sections.push(inst);
        else sections.splice(atIndex, 0, inst);
        return { ...p, sections };
      });
    },
    [commit],
  );

  const removeSection = useCallback(
    (id: string) => commit((p) => ({ ...p, sections: p.sections.filter((s) => s.id !== id) })),
    [commit],
  );

  const duplicateSection = useCallback(
    (id: string) =>
      commit((p) => {
        const idx = p.sections.findIndex((s) => s.id === id);
        if (idx < 0) return p;
        const src = p.sections[idx];
        const copy = { ...src, id: crypto.randomUUID(), props: cloneProps(src.props) };
        const sections = [...p.sections];
        sections.splice(idx + 1, 0, copy);
        return { ...p, sections };
      }),
    [commit],
  );

  const toggleHidden = useCallback(
    (id: string) =>
      commit((p) => ({
        ...p,
        sections: p.sections.map((s) => (s.id === id ? { ...s, hidden: !s.hidden } : s)),
      })),
    [commit],
  );

  const moveSection = useCallback(
    (id: string, dir: -1 | 1) =>
      commit((p) => {
        const idx = p.sections.findIndex((s) => s.id === id);
        const target = idx + dir;
        if (idx < 0 || target < 0 || target >= p.sections.length) return p;
        const sections = [...p.sections];
        [sections[idx], sections[target]] = [sections[target], sections[idx]];
        return { ...p, sections };
      }),
    [commit],
  );

  const reorderSections = useCallback(
    (fromId: string, toId: string) =>
      commit((p) => {
        const from = p.sections.findIndex((s) => s.id === fromId);
        const to = p.sections.findIndex((s) => s.id === toId);
        if (from < 0 || to < 0 || from === to) return p;
        const sections = [...p.sections];
        const [moved] = sections.splice(from, 1);
        sections.splice(to, 0, moved);
        return { ...p, sections };
      }),
    [commit],
  );

  const updateProp = useCallback(
    (id: string, key: string, value: PropValue) =>
      commit((p) => ({
        ...p,
        sections: p.sections.map((s) =>
          s.id === id ? { ...s, props: { ...s.props, [key]: value } } : s,
        ),
      })),
    [commit],
  );

  // --- List (structural) operations -----------------------------------------

  const updateSectionList = useCallback(
    (id: string, key: string, fn: (items: Record<string, string>[]) => Record<string, string>[]) =>
      commit((p) => ({
        ...p,
        sections: p.sections.map((s) => {
          if (s.id !== id) return s;
          const cur = Array.isArray(s.props[key]) ? (s.props[key] as Record<string, string>[]) : [];
          return { ...s, props: { ...s.props, [key]: fn(cur) as PropValue } };
        }),
      })),
    [commit],
  );

  const addListItem = useCallback(
    (id: string, key: string) => {
      const section = project.sections.find((s) => s.id === id);
      if (!section) return;
      updateSectionList(id, key, (items) => [...items, newListItem(section.variantId, key)]);
    },
    [project.sections, updateSectionList],
  );

  const removeListItem = useCallback(
    (id: string, key: string, itemId: string) =>
      updateSectionList(id, key, (items) => items.filter((it) => it._id !== itemId)),
    [updateSectionList],
  );

  const updateListItem = useCallback(
    (id: string, key: string, itemId: string, field: string, value: string) =>
      updateSectionList(id, key, (items) =>
        items.map((it) => (it._id === itemId ? { ...it, [field]: value } : it)),
      ),
    [updateSectionList],
  );

  const moveListItem = useCallback(
    (id: string, key: string, itemId: string, dir: -1 | 1) =>
      updateSectionList(id, key, (items) => {
        const idx = items.findIndex((it) => it._id === itemId);
        const target = idx + dir;
        if (idx < 0 || target < 0 || target >= items.length) return items;
        const next = [...items];
        [next[idx], next[target]] = [next[target], next[idx]];
        return next;
      }),
    [updateSectionList],
  );

  // --- Typography ------------------------------------------------------------

  const updateTypography = useCallback(
    (patch: Partial<Typography>) =>
      commit((p) => ({ ...p, typography: { ...p.typography, ...patch } })),
    [commit],
  );

  const renameProject = useCallback((name: string) => commit((p) => ({ ...p, name })), [commit]);

  const undo = useCallback(() => {
    setProject((prev) => {
      const last = history.current.pop();
      if (!last) return prev;
      future.current.push(prev);
      return last;
    });
  }, []);

  const redo = useCallback(() => {
    setProject((prev) => {
      const next = future.current.pop();
      if (!next) return prev;
      history.current.push(prev);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    history.current = [];
    future.current = [];
    setProject(initialProject());
  }, []);

  return {
    project,
    hydrated,
    addSection,
    removeSection,
    duplicateSection,
    toggleHidden,
    moveSection,
    reorderSections,
    updateProp,
    addListItem,
    removeListItem,
    updateListItem,
    moveListItem,
    updateTypography,
    renameProject,
    undo,
    redo,
    reset,
    canUndo: history.current.length > 0,
    canRedo: future.current.length > 0,
  };
}
