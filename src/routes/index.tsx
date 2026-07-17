import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { EditorShell } from "@/components/editor/EditorShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sangre — Construtor visual de sites" },
      { name: "description", content: "Crie sites profissionais em minutos combinando seções pré-desenhadas. Editor visual com preview em tempo real." },
      { property: "og:title", content: "Sangre — Construtor visual de sites" },
      { property: "og:description", content: "Editor de sites baseado em componentes premium. Sem código." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={<div className="h-screen w-screen bg-black" />}>
      <EditorShell />
    </ClientOnly>
  );
}
