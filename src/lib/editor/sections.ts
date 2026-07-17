import type { SectionVariant, SectionKind, SectionInstance } from "./types";
import { NavbarModern, NavbarMinimal } from "@/components/editor/blocks/Navbar";
import { HeroGradient, HeroSplit } from "@/components/editor/blocks/Hero";
import { FeaturesGrid, FeaturesList } from "@/components/editor/blocks/Features";
import { GalleryMasonry } from "@/components/editor/blocks/Gallery";
import { TestimonialsCards } from "@/components/editor/blocks/Testimonials";
import { FAQAccordion } from "@/components/editor/blocks/FAQ";
import { CTABanner } from "@/components/editor/blocks/CTA";
import { FooterDark, FooterMinimal } from "@/components/editor/blocks/Footer";
import type { ComponentType } from "react";

export const VARIANTS: SectionVariant[] = [
  {
    id: "navbar.modern",
    kind: "navbar",
    name: "Navbar Modern",
    description: "Logo + links + CTA com efeito glass",
    schema: [
      { key: "brand", label: "Nome da marca", type: "text" },
      { key: "link1", label: "Link 1", type: "text" },
      { key: "link2", label: "Link 2", type: "text" },
      { key: "link3", label: "Link 3", type: "text" },
      { key: "ctaText", label: "Texto do botão", type: "text" },
    ],
    defaults: { brand: "SANGRE", link1: "Produto", link2: "Preços", link3: "Contato", ctaText: "Começar" },
  },
  {
    id: "navbar.minimal",
    kind: "navbar",
    name: "Navbar Minimal",
    description: "Apenas marca e um link",
    schema: [
      { key: "brand", label: "Nome da marca", type: "text" },
      { key: "ctaText", label: "Texto do link", type: "text" },
    ],
    defaults: { brand: "SANGRE", ctaText: "Entrar" },
  },
  {
    id: "hero.gradient",
    kind: "hero",
    name: "Hero Gradient",
    description: "Título grande com gradiente e CTA",
    schema: [
      { key: "eyebrow", label: "Etiqueta", type: "text" },
      { key: "title", label: "Título", type: "textarea" },
      { key: "subtitle", label: "Subtítulo", type: "textarea" },
      { key: "cta", label: "Botão principal", type: "text" },
      { key: "ctaSecondary", label: "Botão secundário", type: "text" },
    ],
    defaults: {
      eyebrow: "Novo · v1.0",
      title: "Construa sites cinematográficos em minutos",
      subtitle: "Combine seções pré-desenhadas e publique com um clique. Sem código, sem limites.",
      cta: "Começar grátis",
      ctaSecondary: "Ver demo",
    },
  },
  {
    id: "hero.split",
    kind: "hero",
    name: "Hero Split",
    description: "Texto à esquerda, imagem à direita",
    schema: [
      { key: "title", label: "Título", type: "textarea" },
      { key: "subtitle", label: "Subtítulo", type: "textarea" },
      { key: "cta", label: "Botão", type: "text" },
      { key: "image", label: "URL da imagem", type: "image" },
    ],
    defaults: {
      title: "Design que sangra qualidade",
      subtitle: "Cada seção foi desenhada por profissionais. Você apenas escolhe e edita.",
      cta: "Explorar",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
    },
  },
  {
    id: "features.grid",
    kind: "features",
    name: "Serviços · Grid",
    description: "Três colunas com ícones",
    schema: [
      { key: "title", label: "Título da seção", type: "text" },
      { key: "f1title", label: "Feature 1 · título", type: "text" },
      { key: "f1desc", label: "Feature 1 · descrição", type: "textarea" },
      { key: "f2title", label: "Feature 2 · título", type: "text" },
      { key: "f2desc", label: "Feature 2 · descrição", type: "textarea" },
      { key: "f3title", label: "Feature 3 · título", type: "text" },
      { key: "f3desc", label: "Feature 3 · descrição", type: "textarea" },
    ],
    defaults: {
      title: "Tudo o que você precisa",
      f1title: "Componentes prontos",
      f1desc: "Mais de 50 seções cuidadosamente projetadas.",
      f2title: "Preview em tempo real",
      f2desc: "Edite e veja o resultado instantaneamente.",
      f3title: "Publicação em um clique",
      f3desc: "SSL, CDN e domínio próprio já incluídos.",
    },
  },
  {
    id: "features.list",
    kind: "features",
    name: "Serviços · Lista",
    description: "Lista vertical com bullets",
    schema: [
      { key: "title", label: "Título da seção", type: "text" },
      { key: "i1", label: "Item 1", type: "text" },
      { key: "i2", label: "Item 2", type: "text" },
      { key: "i3", label: "Item 3", type: "text" },
      { key: "i4", label: "Item 4", type: "text" },
    ],
    defaults: {
      title: "Por que escolher",
      i1: "Design system consistente",
      i2: "Performance A+ em Lighthouse",
      i3: "Totalmente responsivo",
      i4: "SEO otimizado por padrão",
    },
  },
  {
    id: "gallery.masonry",
    kind: "gallery",
    name: "Galeria",
    description: "Grid de imagens estilo masonry",
    schema: [
      { key: "title", label: "Título", type: "text" },
      { key: "img1", label: "Imagem 1", type: "image" },
      { key: "img2", label: "Imagem 2", type: "image" },
      { key: "img3", label: "Imagem 3", type: "image" },
      { key: "img4", label: "Imagem 4", type: "image" },
    ],
    defaults: {
      title: "Nosso trabalho",
      img1: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800",
      img2: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800",
      img3: "https://images.unsplash.com/photo-1614852206738-c1706ecebbc4?w=800",
      img4: "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800",
    },
  },
  {
    id: "testimonials.cards",
    kind: "testimonials",
    name: "Depoimentos",
    description: "Três cards com quote e autor",
    schema: [
      { key: "title", label: "Título", type: "text" },
      { key: "q1", label: "Quote 1", type: "textarea" },
      { key: "a1", label: "Autor 1", type: "text" },
      { key: "q2", label: "Quote 2", type: "textarea" },
      { key: "a2", label: "Autor 2", type: "text" },
      { key: "q3", label: "Quote 3", type: "textarea" },
      { key: "a3", label: "Autor 3", type: "text" },
    ],
    defaults: {
      title: "O que dizem",
      q1: "Publiquei meu site em 12 minutos. Absurdo.",
      a1: "Marina · Designer",
      q2: "Parece que contratei uma agência inteira.",
      a2: "Rafael · Fundador",
      q3: "A ferramenta mais afiada que já usei.",
      a3: "Julia · Product",
    },
  },
  {
    id: "faq.accordion",
    kind: "faq",
    name: "FAQ",
    description: "Perguntas frequentes em acordeão",
    schema: [
      { key: "title", label: "Título", type: "text" },
      { key: "q1", label: "Pergunta 1", type: "text" },
      { key: "a1", label: "Resposta 1", type: "textarea" },
      { key: "q2", label: "Pergunta 2", type: "text" },
      { key: "a2", label: "Resposta 2", type: "textarea" },
      { key: "q3", label: "Pergunta 3", type: "text" },
      { key: "a3", label: "Resposta 3", type: "textarea" },
    ],
    defaults: {
      title: "Perguntas frequentes",
      q1: "Preciso saber programar?",
      a1: "Não. Todas as edições são feitas em formulários simples.",
      q2: "Posso usar meu domínio?",
      a2: "Sim, conecte qualquer domínio com SSL automático.",
      q3: "Como funciona a exportação?",
      a3: "Você pode exportar como HTML, React, Next.js ou Astro.",
    },
  },
  {
    id: "cta.banner",
    kind: "cta",
    name: "CTA Banner",
    description: "Chamada final com botão",
    schema: [
      { key: "title", label: "Título", type: "textarea" },
      { key: "cta", label: "Botão", type: "text" },
    ],
    defaults: { title: "Pronto para lançar?", cta: "Começar agora" },
  },
  {
    id: "footer.dark",
    kind: "footer",
    name: "Footer Dark",
    description: "Footer completo com colunas",
    schema: [
      { key: "brand", label: "Marca", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "copyright", label: "Copyright", type: "text" },
    ],
    defaults: {
      brand: "SANGRE",
      tagline: "Sites que impressionam.",
      copyright: "© 2026 Sangre. Todos os direitos reservados.",
    },
  },
  {
    id: "footer.minimal",
    kind: "footer",
    name: "Footer Minimal",
    description: "Uma linha centralizada",
    schema: [
      { key: "copyright", label: "Copyright", type: "text" },
    ],
    defaults: { copyright: "© 2026 Sangre" },
  },
];

export const RENDERERS: Record<string, ComponentType<{ props: Record<string, string> }>> = {
  "navbar.modern": NavbarModern,
  "navbar.minimal": NavbarMinimal,
  "hero.gradient": HeroGradient,
  "hero.split": HeroSplit,
  "features.grid": FeaturesGrid,
  "features.list": FeaturesList,
  "gallery.masonry": GalleryMasonry,
  "testimonials.cards": TestimonialsCards,
  "faq.accordion": FAQAccordion,
  "cta.banner": CTABanner,
  "footer.dark": FooterDark,
  "footer.minimal": FooterMinimal,
};

export function getVariant(id: string): SectionVariant | undefined {
  return VARIANTS.find((v) => v.id === id);
}

export function variantsByKind(): Record<SectionKind, SectionVariant[]> {
  const out = {} as Record<SectionKind, SectionVariant[]>;
  for (const v of VARIANTS) {
    (out[v.kind] ||= []).push(v);
  }
  return out;
}

export function createInstance(variantId: string): SectionInstance {
  const v = getVariant(variantId)!;
  return {
    id: crypto.randomUUID(),
    variantId,
    props: { ...v.defaults },
  };
}
