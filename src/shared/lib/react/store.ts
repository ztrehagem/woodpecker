export class Store<State extends object> {
  #state: State;

  readonly #e = new EventTarget();

  constructor(state: State) {
    this.#state = state;
  }

  get state(): Readonly<State> {
    return this.#state;
  }

  protected setState(fn: (state: State) => State): void {
    this.#state = fn(this.#state);
    this.#notify();
  }

  readonly subscribe = (callback: () => void): (() => void) => {
    const ac = new AbortController();

    this.#e.addEventListener("change", callback, { signal: ac.signal });

    return () => {
      ac.abort();
    };
  };

  #notify() {
    this.#e.dispatchEvent(new Event("change"));
  }
}
