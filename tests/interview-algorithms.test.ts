import { describe, expect, it, vi } from 'vitest';
import { createStore, promiseAll, runWithLimit } from '../src/features/interview/algorithms';

describe('promiseAll', () => {
  it('accepts values and thenables while preserving input order', async () => {
    const slow = new Promise<number>((resolve) => setTimeout(() => resolve(1), 5));
    await expect(promiseAll([slow, Promise.resolve(2), 3] as const)).resolves.toEqual([1, 2, 3]);
  });
  it('handles empty input and rejects on the first observed rejection', async () => {
    await expect(promiseAll([])).resolves.toEqual([]);
    await expect(
      promiseAll([Promise.reject(new Error('first')), Promise.resolve(2)]),
    ).rejects.toThrow('first');
  });
});

describe('runWithLimit', () => {
  it('caps active tasks and preserves result order', async () => {
    let active = 0;
    let maximum = 0;
    const tasks = [20, 5, 10, 1].map((delay, index) => async () => {
      active += 1;
      maximum = Math.max(maximum, active);
      await new Promise((resolve) => setTimeout(resolve, delay));
      active -= 1;
      return index;
    });
    await expect(runWithLimit(tasks, 2)).resolves.toEqual([0, 1, 2, 3]);
    expect(maximum).toBe(2);
  });
  it('validates concurrency', async () => {
    await expect(runWithLimit([], 0)).rejects.toThrow('positive integer');
  });
});

describe('createStore', () => {
  it('supports updates, selector equality, reentrant updates, and unsubscribe', () => {
    const store = createStore({ count: 0, label: 'stable' });
    const selected = vi.fn();
    const unsubscribe = store.subscribe((state) => state.label, selected);
    store.subscribe((state) => {
      if (state.count === 1) store.setState((current) => ({ ...current, count: 2 }));
    });
    store.setState((state) => ({ ...state, count: 1 }));
    expect(store.getState().count).toBe(2);
    expect(selected).not.toHaveBeenCalled();
    unsubscribe();
    store.setState((state) => ({ ...state, label: 'changed' }));
    expect(selected).not.toHaveBeenCalled();
  });
});
