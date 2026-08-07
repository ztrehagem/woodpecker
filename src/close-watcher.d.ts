// Not yet included in TypeScript's DOM lib. https://developer.mozilla.org/en-US/docs/Web/API/CloseWatcher
interface CloseWatcher extends EventTarget {
  requestClose(): void;
  close(): void;
  destroy(): void;
  oncancel: ((this: CloseWatcher, ev: Event) => unknown) | null;
  onclose: ((this: CloseWatcher, ev: Event) => unknown) | null;
}

declare const CloseWatcher: {
  prototype: CloseWatcher;
  new (options?: { signal?: AbortSignal }): CloseWatcher;
};
