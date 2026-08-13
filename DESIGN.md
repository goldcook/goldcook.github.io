# Design Direction

The site uses a **research field-notes** visual language: editorial typography, visible grids, signal diagrams, and high-contrast laboratory colors. It should feel curious and unfinished in an intentional way, not like a generic portfolio template.

## Five non-negotiable principles

1. Use Chinese editorial typography, not dashboard typography. Large Song-style headings carry the page; mono labels only provide structure.
2. Keep the paper-and-ink foundation. Acid green, signal red, and cyan are accents rather than decorative gradients.
3. Every visual gesture must support the research metaphor: grids, orbits, indices, notes, and signals.
4. Preserve asymmetry on desktop but restore a clear single-column reading order on mobile.
5. Motion must reveal hierarchy or communicate state. It must also disappear under `prefers-reduced-motion`.

## Tokens

Core tokens live in `styles.css` under `:root`.

- Background: `--paper`, `--paper-deep`
- Text: `--ink`, `--ink-soft`
- Accents: `--acid`, `--red`, `--blue`
- Display type: `--font-display`
- Body type: `--font-body`
- Metadata: `--font-mono`
- Layout: `--page-padding`, `--section-gap`

## Content model

Repeatable content is kept in `content.js`: facts, focus areas, and notes. Structural copy and SEO metadata remain in `index.html` so the page is readable and indexable without JavaScript.
