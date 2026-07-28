// Minimal className combinator so we don't add a dependency for this alone.
export function clsx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}