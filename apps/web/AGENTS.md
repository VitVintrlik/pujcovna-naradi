# AGENTS.md – apps/web (frontend)

> Extends the root `AGENTS.md` and never contradicts it.

## Layout

- Put a screen with its own URL in `src/pages/` as `<Name>Page.tsx`; one page per route.
- Put a component that knows the domain (tools, orders, categories…) in `src/components/`.
- Put a generic component (button, table, dialog) in `packages/ui`, never in `apps/web`.
- Put data loading and logic that needs React in `src/hooks/`, one hook per file (`use-tools.ts`).
- Put logic without React in `src/utils/` as pure functions.
- Keep every route in `src/routes.tsx`; it is the Application Model's route list.

## Pages and components

- Let a page only call hooks, define handlers and compose components.
- Keep a component in `src/components/` presentational: it renders its props and calls the callbacks it gets.
- Load data in the page through a hook and pass it down; never load data in a component.
- Use the `packages/ui` component before writing a native `<button>`, `<input>`, `<select>` or `<dialog>`.
- Render the loading, the error and the empty state of every data-driven page with `LoadingState`, `ErrorState` and `EmptyState`.
- Confirm every action the user story asks to confirm with `ConfirmDialog`.

## Routing

- Build every link with `src/paths.ts`; never a template-string URL.
- Read route params with `useRouteParams(schema)`; never use a raw `useParams()` value.
- Wrap a worker page in `RequireRole` in `src/routes.tsx`; the backend still enforces the role.

## Data

- Load and change server data only with TanStack Query (`useQuery`, `useMutation`) inside a hook.
- Never load data in `useEffect`.
- Call the backend only through `src/api/client.ts`; never call `fetch` anywhere else.
- Keep a query key in the hook that reads the data; a mutation imports it from there.
- Invalidate the keys a mutation affects in `onSettled`.
- Use `useEffect` only for subscriptions and timers; derive state during render.

## Forms

- Build every form with react-hook-form and the endpoint contract's `body` schema through `zodResolver`.
- Never validate a field again by hand when the schema already validates it.
- Show the backend error's `message` to the user; never swallow it.

## Text

- Write UI text in Czech; translate messages the user stories give in Slovak.
- Take message texts from the user story or business use case they belong to.

## Styling

- Style with Tailwind classes; never write a CSS file for a component or use the `style` prop for a static value.
- Use the theme colors from `packages/ui`, never a hard-coded color; use the standard Tailwind scale for spacing and sizes.

## Verification

- After `pnpm check` and `pnpm build`, run `pnpm dev`, open the page in a browser and use it with real clicks and typing: the happy path, the loading, error and empty states, and a signed-out visit
