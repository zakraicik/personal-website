export async function register() {
  // Node.js 22+ with --localstorage-file creates a broken localStorage global
  // where getItem/setItem are not functions. Remove it so MUI SSR behaves correctly.
  if (
    typeof globalThis.localStorage !== "undefined" &&
    typeof globalThis.localStorage.getItem !== "function"
  ) {
    delete (globalThis as unknown as Record<string, unknown>).localStorage;
  }
}
