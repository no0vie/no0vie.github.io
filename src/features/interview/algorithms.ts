export function promiseAll<const Values extends readonly unknown[]>(
  values: Values,
): Promise<{ -readonly [Index in keyof Values]: Awaited<Values[Index]> }> {
  type Results = { -readonly [Index in keyof Values]: Awaited<Values[Index]> };
  return new Promise((resolve, reject) => {
    if (values.length === 0) {
      resolve([] as unknown as Results);
      return;
    }
    const results: unknown[] = new Array(values.length);
    let remaining = values.length;
    values.forEach((value, index) => {
      Promise.resolve(value).then((result) => {
        results[index] = result;
        remaining -= 1;
        if (remaining === 0) resolve(results as Results);
      }, reject);
    });
  });
}

export async function runWithLimit<Result>(
  tasks: readonly (() => Promise<Result>)[],
  concurrency: number,
): Promise<Result[]> {
  if (!Number.isInteger(concurrency) || concurrency < 1)
    throw new RangeError('concurrency must be a positive integer');
  const results = new Array<Result>(tasks.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < tasks.length) {
      const index = nextIndex;
      nextIndex += 1;
      const task = tasks[index];
      if (task) results[index] = await task();
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker()));
  return results;
}

type Updater<State> = State | ((state: State) => State);
type Unsubscribe = () => void;
interface Store<State> {
  getState(): State;
  setState(updater: Updater<State>): void;
  subscribe(listener: (state: State) => void): Unsubscribe;
  subscribe<Selection>(
    selector: (state: State) => Selection,
    listener: (selection: Selection) => void,
    equality?: (left: Selection, right: Selection) => boolean,
  ): Unsubscribe;
}

export function createStore<State>(initialState: State): Store<State> {
  let state = initialState;
  let notifying = false;
  let pending = false;
  const listeners = new Set<() => void>();
  function notify() {
    if (notifying) {
      pending = true;
      return;
    }
    notifying = true;
    do {
      pending = false;
      for (const listener of [...listeners]) listener();
    } while (pending);
    notifying = false;
  }
  return {
    getState: () => state,
    setState(updater) {
      const next =
        typeof updater === 'function' ? (updater as (value: State) => State)(state) : updater;
      if (Object.is(next, state)) return;
      state = next;
      notify();
    },
    subscribe<Selection>(
      selectorOrListener: ((state: State) => Selection) | ((state: State) => void),
      selectedListener?: (selection: Selection) => void,
      equality: (left: Selection, right: Selection) => boolean = Object.is,
    ) {
      if (!selectedListener) {
        const listener = () => selectorOrListener(state);
        listeners.add(listener);
        return () => listeners.delete(listener);
      }
      const selector = selectorOrListener as (value: State) => Selection;
      let previous = selector(state);
      const listener = () => {
        const next = selector(state);
        if (equality(previous, next)) return;
        previous = next;
        selectedListener(next);
      };
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
