export class ReactExternalStore {
  readonly #e = new EventTarget();

  readonly subscribe = (callback: () => void): (() => void) => {
    const abortController = new AbortController();
    this.#e.addEventListener("change", callback, { signal: abortController.signal });
    return () => abortController.abort();
  };

  protected notifyChange(): void {
    this.#e.dispatchEvent(new Event("change"));
  }
}
