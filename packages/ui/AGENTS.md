# AGENTS.md – packages/ui (design system)

> Extends the root `AGENTS.md` and never contradicts it. Carve-out: shadcn/ui's own files keep their kebab-case names and their compound components (`Card`, `CardHeader`, `CardContent`…) in one file, as the shadcn CLI writes them.

## Boundaries

- Keep every component generic; it knows nothing about tools, orders or any other domain entity.
- Never import TanStack Query, the API client, contracts from `@pujcovna/shared` or anything from `apps/*`.
- Take all data and state as props and report changes through callback props.
- Export every component from the package's `index.ts`.

## shadcn/ui

- Add a shadcn/ui component with the shadcn CLI into this package; never copy it by hand from the website.
- Change a shadcn/ui component only to fit our design; keep its accessibility attributes and keyboard behaviour.
- Build our own components (`LoadingState`, `ErrorState`, `EmptyState`, `ConfirmDialog`) from shadcn/ui components, one per `PascalCase.tsx` file.

## Styling

- Style only with Tailwind classes and compose them with `cn(...)`; never concatenate class strings.
- Define colors, radii and fonts as CSS variables in the theme file; never hard-code a color in a component.
- Declare a component's variants and sizes in one `cva(...)` call with its `defaultVariants`, and derive the prop type with `VariantProps`.
- Never use an arbitrary Tailwind value such as `p-[14px]`; use the Tailwind scale.

## Verification

- After `pnpm check` and `pnpm build`, check every changed component in the web app in a browser, with the keyboard as well as the mouse.
