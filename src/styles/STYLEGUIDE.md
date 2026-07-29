Short style guide — design tokens and usage

Overview
- Design tokens are exposed as CSS variables in `src/styles/design-tokens.css` and as JS helpers in `src/styles/designTokens.ts`.

Tokens
- Colors: `--color-brand-600`, `--color-pitch-default`, `--color-success`, `--color-error`, etc.
- Spacing: `--space-1` .. `--space-6`.
- Radii: `--radius-card`.
- Shadows: `--shadow-card`.
- Focus: `--focus-ring`.

Usage
- Prefer CSS variables for runtime styles and theming. Example in JSX:

  <div style={{ backgroundColor: 'var(--color-brand-500)' }} />

- Prefer the component utility classes that map to tokens:
  - Buttons: use `btn` + `btn-primary|btn-secondary|btn-ghost|btn-danger`.
  - Containers: use `card` for consistent border, background and shadow.

Migration notes
- Replace hard-coded Tailwind color utilities in shared components with token-backed classes (done for `Button` and `Card`).
- For one-off components, you can either use inline `style={{ backgroundColor: 'var(--color-...)' }}` or add a small class to `design-tokens.css`.

Accessibility
- Use `--focus-ring` for visible focus styles.
- Ensure text contrast remains WCAG AA compliant; tokens are chosen to be legible but review when customizing.

Extending
- To add theme variants, add `:root[data-theme="dark"] { ... }` or extend the media query at the bottom of `design-tokens.css`.

Files
- Tokens: [src/styles/design-tokens.css](src/styles/design-tokens.css)
- JS helpers: [src/styles/designTokens.ts](src/styles/designTokens.ts)
- Button component: [src/components/ui/Button.tsx](src/components/ui/Button.tsx)
- Card component: [src/components/ui/Card.tsx](src/components/ui/Card.tsx)

If you'd like, I can:
- Apply token-backed styles to `Input` and `Select` next.
- Add Tailwind config mappings for tokens.
- Run a visual pass to ensure spacing and color parity after migration.
