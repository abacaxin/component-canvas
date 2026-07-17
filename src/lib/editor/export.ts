import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import type { ProjectState } from "./types";
import { RENDERERS } from "./sections";
import { activeFonts, googleFontsHref, typographyVars } from "./typography";

export function exportHTML(project: ProjectState): string {
  const body = project.sections
    .filter((s) => !s.hidden)
    .map((s) => {
      const R = RENDERERS[s.variantId];
      if (!R) return "";
      return renderToStaticMarkup(createElement(R, { props: s.props }));
    })
    .join("\n");

  const t = project.typography;
  const fontsHref = googleFontsHref(activeFonts(t));
  const fontsLink = fontsHref ? `<link href="${fontsHref}" rel="stylesheet" />` : "";
  const vars = Object.entries(typographyVars(t))
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");

  return `<!doctype html>
<html lang="pt-BR" class="dark">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(project.name)}</title>
<meta name="description" content="${escapeHtml(project.name)} — feito com Sangre." />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
${fontsLink}
<script src="https://cdn.tailwindcss.com"></script>
<style>
  :root {
    color-scheme: dark;
${vars}
  }
  html, body {
    background: #000;
    color: #fff;
    font-family: var(--site-body-font);
    font-weight: var(--site-body-weight);
    line-height: var(--site-line-height);
    letter-spacing: var(--site-letter-spacing);
    font-size: var(--site-base-size);
  }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export function downloadHTML(project: ProjectState) {
  const html = exportHTML(project);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${project.name.replace(/[^\w-]+/g, "-").toLowerCase() || "site"}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
