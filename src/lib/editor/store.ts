import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectState, SectionInstance } from "./types";
import { createInstance } from "./sections";

const STORAGE_KEY = "sangre.project.v1";
const MAX_HISTORY = 50;

function initialProject(): ProjectState {
  return {
    name: "Meu site",
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

export function useProject() {
  const [project, setProject] = useState<ProjectState>(initialProject);
  const [hydrated, setHydrated] = useState(false);
  const history = useRef<ProjectState[]>([]);
  const future = useRef<ProjectState[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProject(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  // Autosave
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch {}
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
        const copy: SectionInstance = { ...p.sections[idx], id: crypto.randomUUID(), props: { ...p.sections[idx].props } };
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
    (id: string, key: string, value: string) =>
      commit((p) => ({
        ...p,
        sections: p.sections.map((s) => (s.id === id ? { ...s, props: { ...s.props, [key]: value } } : s)),
      })),
    [commit],
  );

  const renameProject = useCallback(
    (name: string) => commit((p) => ({ ...p, name })),
    [commit],
  );

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
    updateProp,
    renameProject,
    undo,
    redo,
    reset,
    canUndo: history.current.length > 0,
    canRedo: future.current.length > 0,
  };
}
