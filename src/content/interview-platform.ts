const stateSolution = `type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading'; requestId: string }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

type Action<T> =
  | { type: 'start'; requestId: string }
  | { type: 'resolve'; data: T }
  | { type: 'reject'; error: Error }
  | { type: 'reset' };

function assertNever(value: never): never {
  throw new Error(\`Unexpected action: \${JSON.stringify(value)}\`);
}

export function reducer<T>(state: RequestState<T>, action: Action<T>): RequestState<T> {
  switch (action.type) {
    case 'start': return { status: 'loading', requestId: action.requestId };
    case 'resolve': return state.status === 'loading' ? { status: 'success', data: action.data } : state;
    case 'reject': return state.status === 'loading' ? { status: 'error', error: action.error } : state;
    case 'reset': return { status: 'idle' };
    default: return assertNever(action);
  }
}`;

const stateTests = `import { describe, expect, it } from 'vitest';
import { reducer } from './request-state';

describe('request reducer', () => {
  it('resolves only an active request', () => {
    expect(reducer({ status: 'idle' }, { type: 'resolve', data: 42 })).toEqual({ status: 'idle' });
    expect(reducer({ status: 'loading', requestId: 'r1' }, { type: 'resolve', data: 42 }))
      .toEqual({ status: 'success', data: 42 });
  });
});`;

const buttonSolution = `import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';

type OwnProps<E extends ElementType> = {
  as?: E;
  children: ReactNode;
  tone?: 'primary' | 'quiet';
};

type PolymorphicProps<E extends ElementType> = OwnProps<E> &
  Omit<ComponentPropsWithRef<E>, keyof OwnProps<E>>;

type ButtonComponent = <E extends ElementType = 'button'>(
  props: PolymorphicProps<E>,
) => ReactNode;

export const Button: ButtonComponent = ({ as, tone = 'primary', ...props }) => {
  const Component: ElementType = as ?? 'button';
  return <Component data-tone={tone} {...props} />;
};

const native = <Button onClick={(event) => event.currentTarget.focus()}>Save</Button>;
const link = <Button as="a" href="/docs">Docs</Button>;
// @ts-expect-error href is not a button attribute
const invalid = <Button href="/docs">Broken</Button>;`;

const groupingSolution = `export function groupBy<T, K extends PropertyKey>(
  items: readonly T[],
  keyOf: (item: T) => K,
): Map<K, T[]> {
  const result = new Map<K, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    const group = result.get(key);
    if (group) group.push(item);
    else result.set(key, [item]);
  }
  return result;
}

export function indexBy<T, K extends PropertyKey>(
  items: readonly T[],
  keyOf: (item: T) => K,
): Map<K, T> {
  const result = new Map<K, T>();
  for (const item of items) {
    const key = keyOf(item);
    if (result.has(key)) throw new Error(\`Duplicate key: \${String(key)}\`);
    result.set(key, item);
  }
  return result;
}`;

const groupingTests = `import { expect, it } from 'vitest';

it('groups without string coercion and rejects duplicate index keys', () => {
  const a = Symbol('team');
  const grouped = groupBy([{ team: a, id: 1 }, { team: a, id: 2 }], (item) => item.team);
  expect(grouped.get(a)?.map((item) => item.id)).toEqual([1, 2]);
  expect(() => indexBy([{ id: 'x' }, { id: 'x' }], (item) => item.id)).toThrow('Duplicate key: x');
});`;

const leakSolution = `import { useEffect } from 'react';

export function useLiveFeed(url: string, onMessage: (value: string) => void): void {
  useEffect(() => {
    const controller = new AbortController();
    const socket = new WebSocket(url);
    const onVisibility = (): void => {
      if (document.hidden) socket.close(1000, 'page hidden');
    };
    socket.addEventListener('message', (event: MessageEvent<string>) => onMessage(event.data));
    document.addEventListener('visibilitychange', onVisibility, { signal: controller.signal });

    return () => {
      controller.abort();
      socket.close(1000, 'component unmounted');
    };
  }, [url, onMessage]);
}`;

const virtualSolution = `export interface WindowRange {
  start: number;
  end: number;
  offset: number;
}

export function getWindowRange(
  scrollTop: number,
  viewportHeight: number,
  rowHeight: number,
  count: number,
  overscan = 5,
): WindowRange {
  if (rowHeight <= 0 || count < 0) throw new RangeError('Invalid list dimensions');
  const first = Math.floor(Math.max(0, scrollTop) / rowHeight);
  const visible = Math.ceil(viewportHeight / rowHeight);
  const start = Math.max(0, first - overscan);
  const end = Math.min(count, first + visible + overscan);
  return { start, end, offset: start * rowHeight };
}

// Render items.slice(start, end) inside a position:relative spacer whose
// height is count * rowHeight; translate the window by offset pixels.`;

const virtualTests = `import { expect, it } from 'vitest';

it('clamps a fixed-height window at both list boundaries', () => {
  expect(getWindowRange(-20, 100, 20, 100_000, 2)).toEqual({ start: 0, end: 7, offset: 0 });
  const last = getWindowRange(1_999_980, 100, 20, 100_000, 2);
  expect(last.end).toBe(100_000);
  expect(last.start).toBeGreaterThanOrEqual(0);
});`;

const storeSolution = `import { useSyncExternalStore } from 'react';

type Listener = () => void;

export interface Store<S> {
  getSnapshot: () => S;
  set: (update: S | ((previous: S) => S)) => void;
  subscribe: (listener: Listener) => () => void;
}

export function createStore<S>(initial: S): Store<S> {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    getSnapshot: () => state,
    set(update) {
      const next = typeof update === 'function'
        ? (update as (previous: S) => S)(state)
        : update;
      if (Object.is(next, state)) return;
      state = next;
      for (const listener of [...listeners]) listener();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<S>(store: Store<S>): S {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}`;

const storeTests = `import { expect, it, vi } from 'vitest';

it('publishes changed snapshots and supports unsubscribe', () => {
  const store = createStore({ count: 0 });
  const listener = vi.fn();
  const unsubscribe = store.subscribe(listener);
  store.set((state) => ({ count: state.count + 1 }));
  expect(store.getSnapshot()).toEqual({ count: 1 });
  expect(listener).toHaveBeenCalledTimes(1);
  unsubscribe();
  store.set({ count: 2 });
  expect(listener).toHaveBeenCalledTimes(1);
});`;

const renderingSolution = `type Job = () => void;
const reads: Job[] = [];
const writes: Job[] = [];
let scheduled = false;

export function scheduleFrame(read: Job, write: Job): void {
  reads.push(read);
  writes.push(write);
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    for (const job of reads.splice(0)) job();
    for (const job of writes.splice(0)) job();
    scheduled = false;
  });
}

export function observeRendering(report: (name: string, value: number) => void): () => void {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'longtask') report('longtask', entry.duration);
      if (entry.entryType === 'layout-shift' && !('hadRecentInput' in entry && entry.hadRecentInput)) {
        report('layout-shift', 'value' in entry && typeof entry.value === 'number' ? entry.value : 0);
      }
    }
  });
  observer.observe({ entryTypes: ['longtask', 'layout-shift'] });
  return () => observer.disconnect();
}`;

export const platformExercises = [
  {
    id: '06',
    slug: 'discriminated-union-state',
    category: 'typescript',
    difficulty: 'hard',
    estimatedMinutes: 45,
    tags: ['TypeScript', 'state-machine', 'exhaustiveness'],
    runtime: 'universal',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Состояние запроса как дискриминируемое объединение',
        description: 'Спроектируйте невозможные состояния из типовой модели асинхронного запроса.',
        problem:
          'Компонент хранит флаги loading, error и data независимо, поэтому допускает противоречивые комбинации: одновременно загрузку и ошибку либо успешный ответ без данных. Замените модель конечным автоматом на TypeScript и реализуйте переходы так, чтобы компилятор проверял полноту обработки событий.',
        examples: [
          'idle → start → loading → resolve → success',
          'Событие resolve в idle не меняет состояние.',
        ],
        requirements: [
          'Опишите состояния и события дискриминируемыми объединениями без необязательных полей.',
          'Реализуйте чистый обобщённый reducer и исчерпывающую проверку switch.',
          'Не допускайте resolve/reject до start; добавьте проверяемый пример или тест.',
        ],
        starterCode: {
          label: 'Заготовка',
          language: 'ts',
          code: `type RequestState<T> = unknown;\ntype Action<T> = unknown;`,
        },
        hints: [
          'Сначала перечислите допустимые снимки состояния; общий литеральный ключ status станет дискриминантом.',
          'Сузьте action через switch по type, а допустимость перехода дополнительно проверьте по текущему state.status.',
          'В default передайте action функции с параметром never: новая ветка объединения тогда вызовет ошибку компиляции.',
        ],
        solution: {
          blocks: [
            { label: 'Реализация', language: 'ts', code: stateSolution },
            { label: 'Vitest', language: 'ts', code: stateTests },
          ],
          alternative: [
            'Можно выразить переходы таблицей, но reducer со switch обычно проще типизировать и читать.',
            'Для конкурентных запросов добавьте requestId в события завершения и игнорируйте устаревшие ответы.',
          ],
        },
        explanation: [
          'Объединение делает недопустимые комбинации невыразимыми: data существует только в success, error — только в error.',
          'Проверка never превращает добавление нового события без обработчика в ошибку сборки, а guard состояния защищает переходы во время выполнения.',
        ],
        edgeCases: [
          'Повторный start во время loading должен иметь явно выбранную семантику.',
          'Поздний ответ отменённого запроса нельзя применять к новому запросу.',
          'Error следует хранить как объект или нормализованную структуру, а не терять причину.',
        ],
        complexity: ['Каждый переход занимает O(1) времени и O(1) дополнительной памяти.'],
        followUps: [
          'Добавьте cancelled и событие cancel.',
          'Сделайте таблицу разрешённых переходов типобезопасной.',
          'Объясните сериализацию Error для SSR или DevTools.',
        ],
        production: [
          'В продукте reducer связывают с AbortController, requestId и телеметрией ошибок; модель состояния не заменяет отмену реального I/O.',
        ],
        furtherReading: [
          {
            label: 'TypeScript: narrowing',
            url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html',
          },
        ],
      },
      en: {
        title: 'Model request state with a discriminated union',
        description: 'Design impossible states out of an asynchronous request model.',
        problem:
          'A component stores loading, error, and data independently, allowing contradictory combinations such as loading with an error or a successful response without data. Replace those flags with a TypeScript state machine and implement transitions so the compiler verifies exhaustive event handling.',
        examples: [
          'idle → start → loading → resolve → success',
          'A resolve event received in idle leaves the state unchanged.',
        ],
        requirements: [
          'Represent states and events as discriminated unions without optional payload fields.',
          'Implement a pure generic reducer with an exhaustive switch check.',
          'Reject resolve/reject before start and include a verifiable example or test.',
        ],
        starterCode: {
          label: 'Starter',
          language: 'ts',
          code: `type RequestState<T> = unknown;\ntype Action<T> = unknown;`,
        },
        hints: [
          'List every valid state snapshot first; a shared literal status property can act as the discriminator.',
          'Narrow action with a switch on type, then guard each transition with the current state.status when necessary.',
          'Pass action to a function accepting never in the default branch, so adding an unhandled action fails compilation.',
        ],
        solution: {
          blocks: [
            { label: 'Implementation', language: 'ts', code: stateSolution },
            { label: 'Vitest', language: 'ts', code: stateTests },
          ],
          alternative: [
            'A transition table is possible, but a reducer switch is usually easier to type and review.',
            'For concurrent requests, carry requestId through completion actions and ignore stale responses.',
          ],
        },
        explanation: [
          'The union makes invalid combinations unrepresentable: data exists only in success and error exists only in error.',
          'The never check turns an unhandled future event into a build error, while the state guard protects runtime transitions.',
        ],
        edgeCases: [
          'A repeated start while loading needs an explicit replacement or rejection policy.',
          'A late response from an aborted request must not overwrite a newer request.',
          'Preserve an Error or normalized diagnostic object instead of discarding failure context.',
        ],
        complexity: ['Each transition takes O(1) time and O(1) additional space.'],
        followUps: [
          'Add a cancelled state and cancel event.',
          'Create a type-safe allowed-transition table.',
          'Discuss serializing Error across SSR or developer tooling boundaries.',
        ],
        production: [
          'Connect the reducer to AbortController, request identifiers, and error telemetry; a state model does not cancel actual I/O.',
        ],
        furtherReading: [
          {
            label: 'TypeScript: narrowing',
            url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html',
          },
        ],
      },
    },
  },
  {
    id: '07',
    slug: 'type-safe-polymorphic-button',
    category: 'typescript',
    difficulty: 'senior',
    estimatedMinutes: 60,
    tags: ['React', 'TypeScript', 'accessibility'],
    runtime: 'react',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Типобезопасная полиморфная кнопка',
        description: 'Создайте React-компонент с корректными props выбранного элемента.',
        problem:
          'Дизайн-системе нужен Button, который по умолчанию рендерит button, но через as может стать ссылкой или пользовательским компонентом. Типы должны подхватывать нативные атрибуты и ref выбранного элемента, не допускать конфликтов собственных props и сохранять доступную семантику.',
        examples: [
          '<Button onClick={save}>Save</Button>',
          '<Button as="a" href="/docs">Docs</Button>',
        ],
        requirements: [
          'Выведите атрибуты и ref из ElementType без any.',
          'Исключите из нативных props ключи собственных props компонента.',
          'Покажите положительные примеры и отрицательную compile-time проверку href.',
        ],
        starterCode: {
          label: 'API',
          language: 'tsx',
          code: `export function Button(props: unknown) {\n  return null;\n}`,
        },
        hints: [
          'Параметризуйте props типом E extends ElementType и задайте button как тип по умолчанию.',
          'Объедините OwnProps<E> с Omit<ComponentPropsWithRef<E>, keyof OwnProps<E>>, чтобы собственные ключи имели приоритет.',
          'Проверяйте контракт через @ts-expect-error: href без as="a" обязан быть ошибкой, а обработчик должен получить точный тип события.',
        ],
        solution: {
          blocks: [{ label: 'React + TypeScript', language: 'tsx', code: buttonSolution }],
          alternative: [
            'Для ограниченной дизайн-системы union из button и a проще и часто даёт более понятные ошибки.',
            'React 18 может потребовать forwardRef и отдельное приведение; в React 19 ref является обычным prop.',
          ],
        },
        explanation: [
          'ElementType связывает значение as с разрешёнными JSX-атрибутами, а ComponentPropsWithRef сохраняет конкретный тип ref.',
          'Omit предотвращает пересечение несовместимых одноимённых props; compile-time пример фиксирует контракт без выполнения кода.',
        ],
        edgeCases: [
          'Ссылка без href может вести себя не как ссылка и требует осознанной семантики.',
          'disabled отсутствует у a: используйте aria-disabled и блокируйте активацию явно.',
          'Пользовательский компонент обязан пробрасывать ref и DOM-атрибуты, если контракт это обещает.',
        ],
        complexity: [
          'Типы исчезают во время выполнения; рендер добавляет только один React-элемент, O(1).',
        ],
        followUps: [
          'Добавьте обязательный href для as="a" через ограниченный union.',
          'Реализуйте состояние загрузки без потери доступного имени.',
          'Проверьте клавиатурную активацию и ref в React Testing Library.',
        ],
        production: [
          'Не превращайте произвольный div в кнопку: сохраняйте нативную семантику, focus ring, disabled-поведение и достаточную область нажатия.',
        ],
        furtherReading: [
          { label: 'React TypeScript guide', url: 'https://react.dev/learn/typescript' },
        ],
      },
      en: {
        title: 'Type-safe polymorphic button',
        description: 'Build a React component with props matching its selected element.',
        problem:
          'A design system needs a Button that renders a button by default but can become an anchor or custom component through an as prop. Its types must inherit native attributes and the ref for the selected element, resolve collisions with owned props, and preserve accessible semantics.',
        examples: [
          '<Button onClick={save}>Save</Button>',
          '<Button as="a" href="/docs">Docs</Button>',
        ],
        requirements: [
          'Infer attributes and ref from ElementType without any.',
          'Remove owned component keys from inherited native props.',
          'Show valid usages and a negative compile-time check for href.',
        ],
        starterCode: {
          label: 'API',
          language: 'tsx',
          code: `export function Button(props: unknown) {\n  return null;\n}`,
        },
        hints: [
          'Parameterize props with E extends ElementType and use button as the default generic element.',
          'Combine OwnProps<E> with Omit<ComponentPropsWithRef<E>, keyof OwnProps<E>> so owned keys win collisions.',
          'Verify the contract with @ts-expect-error: href without as="a" must fail, while handlers should receive precise event types.',
        ],
        solution: {
          blocks: [{ label: 'React + TypeScript', language: 'tsx', code: buttonSolution }],
          alternative: [
            'For a constrained design system, a button-or-anchor union is simpler and often produces clearer diagnostics.',
            'React 18 may require forwardRef plus a narrow assertion; React 19 treats ref as a regular prop.',
          ],
        },
        explanation: [
          'ElementType connects the as value to valid JSX attributes, while ComponentPropsWithRef preserves the concrete ref type.',
          'Omit avoids incompatible duplicate properties, and the compile-time sample locks down behavior without runtime execution.',
        ],
        edgeCases: [
          'An anchor without href does not reliably behave as a link and needs deliberate semantics.',
          'Anchors have no disabled attribute; use aria-disabled and explicitly suppress activation.',
          'A custom component must forward its ref and DOM attributes if the public contract promises them.',
        ],
        complexity: [
          'Types are erased at runtime; rendering adds one React element and remains O(1).',
        ],
        followUps: [
          'Require href for as="a" with a constrained union.',
          'Add a loading state without removing the accessible name.',
          'Test keyboard activation and refs with React Testing Library.',
        ],
        production: [
          'Do not turn an arbitrary div into a button: preserve native semantics, focus indication, disabled behavior, and an adequate target size.',
        ],
        furtherReading: [
          { label: 'React TypeScript guide', url: 'https://react.dev/learn/typescript' },
        ],
      },
    },
  },
  {
    id: '08',
    slug: 'generic-group-by-index-by',
    category: 'typescript',
    difficulty: 'hard',
    estimatedMinutes: 45,
    tags: ['TypeScript', 'generics', 'collections'],
    runtime: 'universal',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Обобщённые groupBy и indexBy',
        description: 'Сгруппируйте и проиндексируйте данные без потери типов ключей.',
        problem:
          'Реализуйте две функции для readonly-коллекций. groupBy собирает все элементы с одинаковым ключом, а indexBy создаёт уникальный индекс. Решение должно сохранять тип string, number или symbol, не полагаться на небезопасное строковое приведение и явно обрабатывать дубликаты.',
        examples: [
          'groupBy(users, user => user.teamId) возвращает Map<number, User[]>.',
          'indexBy(users, user => user.id) выбрасывает ошибку при повторном id.',
        ],
        requirements: [
          'Сохраните обобщённые типы элемента и ключа PropertyKey.',
          'Не изменяйте входной readonly-массив и сохраните порядок элементов в группах.',
          'Выберите и протестируйте явную политику дубликатов для indexBy.',
        ],
        hints: [
          'Map сохраняет identity и тип number/symbol, в отличие от ключей обычного объекта.',
          'При первом ключе создайте массив, при следующем добавьте элемент в существующую группу.',
          'Проверяйте has до set в indexBy: get не отличает отсутствующий ключ от сохранённого undefined в общем случае.',
        ],
        solution: {
          blocks: [
            { label: 'Реализация', language: 'ts', code: groupingSolution },
            { label: 'Vitest', language: 'ts', code: groupingTests },
          ],
          alternative: [
            'Record подходит, если API намеренно ограничен строковыми ключами и нужен JSON.',
            'Политику last-write-wins допустимо поддержать отдельным параметром, но она не должна быть молчаливой по умолчанию.',
          ],
        },
        explanation: [
          'Map не преобразует ключи в строки, поэтому 1, "1" и Symbol остаются разными значениями.',
          'Один проход сохраняет порядок входа; явная ошибка дубликата предотвращает незаметную потерю данных в индексе.',
        ],
        edgeCases: [
          'Пустой вход возвращает пустой Map.',
          'NaN считается тем же ключом согласно SameValueZero.',
          'Объект не входит в PropertyKey; для ключей-объектов расширьте K до unknown и используйте Map.',
        ],
        complexity: [
          'Ожидаемое время O(n), память O(n); каждая группа хранит ссылки на исходные элементы.',
        ],
        followUps: [
          'Добавьте overload для свойства keyof T.',
          'Сделайте immutable-версию с readonly массивами значений.',
          'Спроектируйте режимы throw, first и last для дубликатов.',
        ],
        production: [
          'Зафиксируйте политику дубликатов в имени/API и ограничьте размер входа при обработке недоверенных данных.',
        ],
        furtherReading: [
          {
            label: 'MDN Map',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
          },
        ],
      },
      en: {
        title: 'Generic groupBy and indexBy',
        description: 'Group and index data without losing key types.',
        problem:
          'Implement two functions for readonly collections. groupBy collects every item sharing a key, while indexBy builds a unique lookup index. The solution must preserve string, number, or symbol key types, avoid unsafe string coercion, and handle duplicate index keys explicitly.',
        examples: [
          'groupBy(users, user => user.teamId) returns Map<number, User[]>.',
          'indexBy(users, user => user.id) throws for a repeated id.',
        ],
        requirements: [
          'Preserve generic item and PropertyKey key types.',
          'Do not mutate the readonly input and retain item order within groups.',
          'Choose and test an explicit duplicate policy for indexBy.',
        ],
        hints: [
          'Map retains number and symbol identity, unlike property keys on a plain object.',
          'Create an array for the first key occurrence, then append subsequent items to the existing group.',
          'Check has before set in indexBy: get alone cannot generally distinguish absence from a stored undefined value.',
        ],
        solution: {
          blocks: [
            { label: 'Implementation', language: 'ts', code: groupingSolution },
            { label: 'Vitest', language: 'ts', code: groupingTests },
          ],
          alternative: [
            'Record is suitable when the API intentionally accepts only string keys and requires JSON output.',
            'A last-write-wins option can be explicit, but silently making it the default risks data loss.',
          ],
        },
        explanation: [
          'Map does not coerce keys to strings, so 1, "1", and Symbol values remain distinct.',
          'A single pass preserves input order, while an explicit duplicate error prevents silent index data loss.',
        ],
        edgeCases: [
          'Empty input returns an empty Map.',
          'NaN values are treated as the same key under SameValueZero.',
          'Objects are not PropertyKey; broaden K to unknown and retain Map if object identity is required.',
        ],
        complexity: [
          'Expected time is O(n) and space is O(n); groups retain references to original items.',
        ],
        followUps: [
          'Add an overload accepting a keyof T property.',
          'Build an immutable variant with readonly value arrays.',
          'Design throw, first, and last duplicate modes.',
        ],
        production: [
          'Document duplicate behavior in the API and bound input size when processing untrusted data.',
        ],
        furtherReading: [
          {
            label: 'MDN Map',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
          },
        ],
      },
    },
  },
  {
    id: '09',
    slug: 'diagnose-memory-leak',
    category: 'browser',
    difficulty: 'senior',
    estimatedMinutes: 60,
    tags: ['DevTools', 'React', 'memory'],
    runtime: 'browser',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Диагностика утечки памяти',
        description: 'Найдите удерживающий путь и исправьте жизненный цикл ресурсов.',
        problem:
          'После многократного открытия и закрытия экрана live-feed память продолжает расти, сообщения обрабатываются несколько раз, а размонтированные компоненты остаются в heap snapshot. Опишите воспроизводимую диагностику в браузере и исправьте подписки, WebSocket, таймеры и незавершённые операции без маскировки симптома.',
        examples: [
          'Снимок A → 20 циклов открытия/закрытия → принудительный GC → снимок B.',
          'Retainers показывают document listener → closure → состояние компонента.',
        ],
        requirements: [
          'Сначала воспроизведите проблему стабильным сценарием и сравните heap snapshots после GC.',
          'Найдите retaining path, а не делайте вывод только по графику памяти.',
          'Покажите симметричное освобождение listener, socket, timer/observer и асинхронной операции.',
        ],
        hints: [
          'Стабилизируйте измерение: одинаковые действия, production-сборка, GC перед каждым снимком и проверка detached DOM trees.',
          'В панели Memory отсортируйте comparison по положительной дельте и пройдите Retainers до GC root.',
          'Каждому acquire нужен release в cleanup; AbortController помогает объединить listener и fetch, но WebSocket закрывается отдельно.',
        ],
        solution: {
          blocks: [{ label: 'Исправленный hook', language: 'tsx', code: leakSolution }],
          alternative: [
            'Для callback, меняющегося каждый render, используйте useCallback или стабильный ref, иначе effect будет корректно, но часто переподписываться.',
            'FinalizationRegistry не является заменой детерминированному cleanup.',
          ],
        },
        explanation: [
          'Heap growth сам по себе не доказывает утечку: GC может ещё не запускаться, а кэш может быть ограниченным. Retaining path показывает, почему объект достижим.',
          'Cleanup запускается перед повторным effect и при unmount; abort удаляет listener, а close освобождает сетевой ресурс.',
        ],
        edgeCases: [
          'StrictMode в разработке намеренно выполняет setup/cleanup повторно и выявляет несимметричные эффекты.',
          'Закрытие socket может породить reconnect-таймер, который тоже нужно отменить.',
          'Promise нельзя отменить напрямую: отменяйте источник работы или игнорируйте результат по signal.',
        ],
        complexity: [
          'Диагностика зависит от размера heap; исправленный cleanup занимает O(1) на экземпляр компонента.',
        ],
        followUps: [
          'Как проверить отсутствие регрессии автоматизированным браузерным тестом?',
          'Чем detached DOM node отличается от большого, но достижимого кэша?',
          'Как ограничить LRU-кэш и наблюдать его бюджет?',
        ],
        production: [
          'Собирайте симптомы без содержимого пользовательской памяти; задайте бюджет, сравнивайте одинаковые сценарии и проверяйте отсутствие роста после плато.',
        ],
        furtherReading: [
          {
            label: 'Chrome memory problems',
            url: 'https://developer.chrome.com/docs/devtools/memory-problems/',
          },
        ],
      },
      en: {
        title: 'Diagnose a browser memory leak',
        description: 'Find the retaining path and repair resource lifecycles.',
        problem:
          'After repeatedly opening and closing a live-feed screen, memory keeps growing, messages are handled multiple times, and unmounted components remain in a heap snapshot. Describe a reproducible browser diagnosis and fix subscriptions, WebSockets, timers, and unfinished work without merely hiding the symptom.',
        examples: [
          'Snapshot A → 20 open/close cycles → forced GC → snapshot B.',
          'Retainers reveal document listener → closure → component state.',
        ],
        requirements: [
          'Reproduce with a stable scenario and compare heap snapshots after garbage collection.',
          'Identify a retaining path instead of relying only on a memory graph.',
          'Demonstrate symmetric cleanup for listeners, sockets, timers/observers, and asynchronous work.',
        ],
        hints: [
          'Stabilize measurement: repeat identical actions in a production build, collect garbage before snapshots, and inspect detached DOM trees.',
          'In Memory comparison, sort by positive delta and follow Retainers all the way to a garbage-collection root.',
          'Every acquisition needs a cleanup release; AbortController can combine listeners and fetch, while WebSocket still closes separately.',
        ],
        solution: {
          blocks: [{ label: 'Corrected hook', language: 'tsx', code: leakSolution }],
          alternative: [
            'If the callback changes every render, use useCallback or a stable ref to avoid correct but excessive resubscription.',
            'FinalizationRegistry is not a replacement for deterministic cleanup.',
          ],
        },
        explanation: [
          'Heap growth alone does not prove a leak: garbage collection may not have run and a bounded cache may be legitimate. A retaining path explains reachability.',
          'Cleanup runs before the effect repeats and on unmount; abort removes the listener while close releases the network resource.',
        ],
        edgeCases: [
          'Development StrictMode deliberately repeats setup and cleanup, exposing asymmetric effects.',
          'Closing a socket may schedule a reconnect timer that must also be cancelled.',
          'Promises are not directly cancellable; abort the work source or ignore its result based on the signal.',
        ],
        complexity: [
          'Diagnostic cost depends on heap size; corrected cleanup is O(1) per mounted component.',
        ],
        followUps: [
          'How would an automated browser test detect the regression?',
          'How does a detached DOM node differ from a large but reachable cache?',
          'How would you bound and observe an LRU cache budget?',
        ],
        production: [
          'Capture symptoms without user-memory contents; define a budget, compare identical flows, and verify memory reaches a plateau.',
        ],
        furtherReading: [
          {
            label: 'Chrome memory problems',
            url: 'https://developer.chrome.com/docs/devtools/memory-problems/',
          },
        ],
      },
    },
  },
  {
    id: '10',
    slug: 'rendering-100000-items',
    category: 'browser',
    difficulty: 'senior',
    estimatedMinutes: 75,
    tags: ['virtualization', 'React', 'performance'],
    runtime: 'react',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Рендеринг 100 000 элементов',
        description: 'Спроектируйте виртуальный список с измеряемой плавностью.',
        problem:
          'Нужно показать 100 000 строк, сохранив нативную прокрутку, управление клавиатурой и доступ к выбранной записи. Полный DOM слишком дорог. Реализуйте вычисление окна для строк фиксированной высоты, overscan и spacer, затем опишите измерение производительности без выдуманных результатов.',
        examples: [
          'При высоте строки 20 px и viewport 100 px видимы пять строк плюс overscan.',
          'DOM содержит O(visible + overscan), а не 100 000 узлов.',
        ],
        requirements: [
          'Рассчитайте start/end/offset с защитой границ и не рендерьте весь массив.',
          'Сохраните общую высоту прокрутки и стабильные ключи элементов.',
          'Опишите фокус, aria-setsize/aria-posinset и измеримый критерий через Performance panel.',
        ],
        hints: [
          'Для фиксированной высоты первый индекс равен floor(scrollTop / rowHeight), после чего расширьте диапазон overscan.',
          'Spacer задаёт полную высоту, а внутреннее окно с transform: translateY(offset) располагает видимые строки.',
          'Активная строка может выйти из окна: храните activeId отдельно и сначала scrollToItem, затем переводите фокус.',
        ],
        solution: {
          blocks: [
            { label: 'Расчёт окна', language: 'ts', code: virtualSolution },
            { label: 'Vitest', language: 'ts', code: virtualTests },
          ],
          alternative: [
            'Для переменной высоты нужен кэш измерений и структура префиксных сумм либо проверенная библиотека виртуализации.',
            'content-visibility помогает отложить часть работы, но не заменяет ограничение количества DOM-узлов.',
          ],
        },
        explanation: [
          'Виртуализация ограничивает reconciliation, layout и paint размером окна, сохраняя scrollbar через виртуальную общую высоту.',
          'Overscan снижает вероятность пустого края при быстрой прокрутке, но увеличивает работу; его значение нужно измерять на целевых устройствах.',
        ],
        edgeCases: [
          'Нулевая или отрицательная высота строки должна завершаться явной ошибкой.',
          'Изменение размера viewport требует пересчёта через ResizeObserver.',
          'Поиск и выделение должны работать по данным, даже когда соответствующий DOM-узел не смонтирован.',
        ],
        complexity: ['Расчёт окна O(1), рендер O(v + overscan), хранение исходных данных O(n).'],
        followUps: [
          'Поддержите строки переменной высоты.',
          'Добавьте sticky-группы без разрушения виртуализации.',
          'Сравните roving tabindex и aria-activedescendant.',
        ],
        production: [
          'Зафиксируйте цель до измерения, например отсутствие long tasks >50 ms в сценарии прокрутки на выбранном устройстве; это критерий проверки, не заявленный результат.',
        ],
        furtherReading: [
          {
            label: 'web.dev virtualize lists',
            url: 'https://web.dev/articles/virtualize-long-lists-react-window',
          },
        ],
      },
      en: {
        title: 'Render 100,000 items',
        description: 'Design a virtual list with measurable scrolling performance.',
        problem:
          'Display 100,000 rows while retaining native scrolling, keyboard operation, and access to the selected record. A full DOM is too expensive. Implement fixed-height window calculation with overscan and a spacer, then describe performance measurement without inventing benchmark outcomes.',
        examples: [
          'With 20 px rows and a 100 px viewport, five rows plus overscan are visible.',
          'The DOM contains O(visible + overscan) rather than 100,000 nodes.',
        ],
        requirements: [
          'Calculate bounded start/end/offset values and never render the complete array.',
          'Preserve total scroll height and stable item keys.',
          'Address focus, aria-setsize/aria-posinset, and a measurable Performance-panel criterion.',
        ],
        hints: [
          'For fixed heights, the first index is floor(scrollTop / rowHeight); expand that range by overscan.',
          'A spacer supplies total height, while an inner window translated by offset positions the rendered rows.',
          'The active row can leave the window: retain activeId in data, scrollToItem first, and then move focus.',
        ],
        solution: {
          blocks: [
            { label: 'Window calculation', language: 'ts', code: virtualSolution },
            { label: 'Vitest', language: 'ts', code: virtualTests },
          ],
          alternative: [
            'Variable heights require a measurement cache and prefix-sum structure or a proven virtualization library.',
            'content-visibility can defer work but does not replace bounding the number of DOM nodes.',
          ],
        },
        explanation: [
          'Virtualization bounds reconciliation, layout, and paint by window size while preserving the scrollbar through virtual total height.',
          'Overscan reduces blank edges during fast scrolling but adds work; tune it through measurements on target devices.',
        ],
        edgeCases: [
          'Zero or negative row height should fail explicitly.',
          'Viewport resize requires recalculation, commonly through ResizeObserver.',
          'Search and selection must operate on data even when a matching DOM node is unmounted.',
        ],
        complexity: [
          'Window calculation is O(1), rendering is O(v + overscan), and source-data storage is O(n).',
        ],
        followUps: [
          'Support variable-height rows.',
          'Add sticky groups without defeating virtualization.',
          'Compare roving tabindex with aria-activedescendant.',
        ],
        production: [
          'Set a target before measurement, such as no long tasks above 50 ms during the chosen scroll scenario on a named device; this is a test criterion, not a claimed result.',
        ],
        furtherReading: [
          {
            label: 'web.dev virtualize lists',
            url: 'https://web.dev/articles/virtualize-long-lists-react-window',
          },
        ],
      },
    },
  },
  {
    id: '11',
    slug: 'reactive-store',
    category: 'typescript',
    difficulty: 'senior',
    estimatedMinutes: 75,
    tags: ['React', 'state-management', 'useSyncExternalStore'],
    runtime: 'react',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Минимальный реактивный store',
        description: 'Реализуйте внешний store с корректной React-подпиской.',
        problem:
          'Создайте типобезопасный внешний store с getSnapshot, set и subscribe, который можно безопасно читать из React при concurrent rendering. Обновления должны быть синхронными и детерминированными, отписка — идемпотентной, а одинаковый snapshot не должен вызывать лишнее уведомление.',
        examples: [
          'store.set(s => ({ count: s.count + 1 })) уведомляет подписчиков один раз.',
          'После unsubscribe listener больше не вызывается.',
        ],
        requirements: [
          'Реализуйте generic API без any и мутации объекта snapshot.',
          'Используйте Object.is для подавления обновления с тем же snapshot.',
          'Подключите store через useSyncExternalStore и протестируйте subscribe/unsubscribe.',
        ],
        hints: [
          'Храните состояние в замыкании, а listeners — в Set, чтобы повторная подписка одного callback не дублировалась.',
          'Сначала вычислите next, сравните Object.is, затем присвойте state и вызовите снимок набора listeners.',
          'React уже предоставляет протокол useSyncExternalStore; собственный useEffect + useState подвержен tearing и пропущенным обновлениям.',
        ],
        solution: {
          blocks: [
            { label: 'Store и hook', language: 'tsx', code: storeSolution },
            { label: 'Vitest', language: 'ts', code: storeTests },
          ],
          alternative: [
            'Selectors требуют кэширования snapshot/selection и equality-функции, иначе компонент будет рендериться слишком часто.',
            'Для SSR передайте отдельный getServerSnapshot, соответствующий гидратируемому состоянию.',
          ],
        },
        explanation: [
          'useSyncExternalStore задаёт React согласованный контракт внешнего источника и повторно проверяет snapshot перед commit.',
          'Копия listeners перед обходом делает уведомление устойчивым к подписке или отписке внутри callback.',
        ],
        edgeCases: [
          'Мутация старого объекта и возврат той же ссылки не будет замечена Object.is.',
          'Listener может вызвать вложенный set; политика пакетирования и порядок должны быть документированы.',
          'Исключение одного listener не должно неявно оставлять store в частично обновлённом состоянии.',
        ],
        complexity: [
          'getSnapshot O(1), subscribe/unsubscribe ожидаемо O(1), set O(number of listeners).',
        ],
        followUps: [
          'Добавьте selectors с equality-функцией.',
          'Реализуйте транзакцию нескольких обновлений.',
          'Объясните SSR snapshot и hydration mismatch.',
        ],
        production: [
          'Добавьте devtools/логирование с редактированием чувствительных данных, ограничьте re-entrant updates и не меняйте snapshot на месте.',
        ],
        furtherReading: [
          {
            label: 'React useSyncExternalStore',
            url: 'https://react.dev/reference/react/useSyncExternalStore',
          },
        ],
      },
      en: {
        title: 'Build a minimal reactive store',
        description: 'Implement an external store with a correct React subscription.',
        problem:
          'Create a type-safe external store with getSnapshot, set, and subscribe that React can read safely during concurrent rendering. Updates must be synchronous and deterministic, unsubscription must be idempotent, and an identical snapshot must not trigger redundant notifications.',
        examples: [
          'store.set(s => ({ count: s.count + 1 })) notifies subscribers once.',
          'After unsubscribe, the listener is no longer called.',
        ],
        requirements: [
          'Implement a generic API without any or in-place snapshot mutation.',
          'Use Object.is to suppress updates retaining the same snapshot.',
          'Connect through useSyncExternalStore and test subscription and unsubscription.',
        ],
        hints: [
          'Keep state in a closure and listeners in a Set so the same callback is not duplicated.',
          'Compute next first, compare with Object.is, assign state, and then iterate over a snapshot of listeners.',
          'React already supplies the useSyncExternalStore protocol; a custom useEffect plus useState can tear or miss updates.',
        ],
        solution: {
          blocks: [
            { label: 'Store and hook', language: 'tsx', code: storeSolution },
            { label: 'Vitest', language: 'ts', code: storeTests },
          ],
          alternative: [
            'Selectors need cached snapshots/selections and an equality function to avoid excessive rendering.',
            'For SSR, provide a distinct getServerSnapshot matching the state used for hydration.',
          ],
        },
        explanation: [
          'useSyncExternalStore gives React a consistency protocol for external sources and rechecks the snapshot before commit.',
          'Iterating over a copy of listeners remains stable when callbacks subscribe or unsubscribe during notification.',
        ],
        edgeCases: [
          'Mutating an old object and returning the same reference is intentionally invisible to Object.is.',
          'A listener can perform a nested set; batching and ordering policy must be documented.',
          'A listener exception should not implicitly leave the store in a partially assigned state.',
        ],
        complexity: [
          'getSnapshot is O(1), subscribe/unsubscribe are expected O(1), and set is O(number of listeners).',
        ],
        followUps: [
          'Add selectors with an equality function.',
          'Implement a transaction for multiple updates.',
          'Explain server snapshots and hydration mismatch.',
        ],
        production: [
          'Add redacted developer tooling, constrain re-entrant updates, and never mutate a published snapshot in place.',
        ],
        furtherReading: [
          {
            label: 'React useSyncExternalStore',
            url: 'https://react.dev/reference/react/useSyncExternalStore',
          },
        ],
      },
    },
  },
  {
    id: '12',
    slug: 'browser-rendering-performance',
    category: 'browser',
    difficulty: 'senior',
    estimatedMinutes: 75,
    tags: ['rendering', 'Web Performance', 'DevTools'],
    runtime: 'browser',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Производительность рендеринга браузера',
        description: 'Диагностируйте layout thrashing, долгие задачи и нестабильность макета.',
        problem:
          'При вводе и прокрутке интерфейс дёргается: обработчик в цикле читает geometry после записи style, крупные компоненты часто перерисовываются, а поздний контент сдвигает страницу. Постройте доказательный план профилирования, исправьте порядок DOM-операций и добавьте наблюдение, не заявляя неизмеренных улучшений.',
        examples: [
          'Плохой цикл: element.style.width = ...; element.getBoundingClientRect().width.',
          'Хороший кадр: сначала все reads, затем все writes внутри requestAnimationFrame.',
        ],
        requirements: [
          'Объясните этапы style → layout → paint → composite и найдите forced synchronous layout в trace.',
          'Сгруппируйте чтения и записи на кадр; не используйте timer как гарантию частоты кадров.',
          'Наблюдайте long tasks/layout shifts и задайте воспроизводимый performance budget как цель.',
        ],
        hints: [
          'Запишите Performance trace с CPU throttling и тем же сценарием; ищите long task, Layout и красные forced-reflow маркеры.',
          'Чередование write/read инвалидирует layout; очередь reads-before-writes позволяет браузеру выполнить один расчёт.',
          'Для анимации предпочитайте transform/opacity, резервируйте размеры медиа и проверяйте результат на целевом устройстве.',
        ],
        solution: {
          blocks: [{ label: 'Планировщик и наблюдение', language: 'ts', code: renderingSolution }],
          alternative: [
            'CSS containment и content-visibility могут сузить область работы, но требуют проверки доступности и размеров.',
            'Web Worker переносит вычисления, но не имеет доступа к DOM и не исправляет дорогой layout.',
          ],
        },
        explanation: [
          'JavaScript может инвалидировать стили, а последующее геометрическое чтение вынуждает браузер синхронно завершить style/layout до возврата значения.',
          'PerformanceObserver годится для полевой телеметрии поддерживаемых entry types; DevTools trace нужен для причинной связи с конкретным кодом.',
        ],
        edgeCases: [
          'Поддержка entry types различается: проверяйте PerformanceObserver.supportedEntryTypes.',
          'requestAnimationFrame в фоновой вкладке ограничивается или приостанавливается.',
          'transform уменьшает layout/paint, но чрезмерное число слоёв расходует GPU-память.',
        ],
        complexity: [
          'Планировщик выполняет O(r + w) задач за кадр; массивы очищаются после выполнения.',
        ],
        followUps: [
          'Как отличить layout-bound сценарий от script-bound?',
          'Когда debounce ухудшает INP, а scheduler помогает?',
          'Как резервировать место для изображений и шрифтов против CLS?',
        ],
        production: [
          'Зафиксируйте устройство, throttling и сценарий; возможная цель — ни одной задачи >50 ms и отсутствие неожиданных layout shifts, но публикуйте только реально измеренный результат.',
        ],
        furtherReading: [
          { label: 'Rendering performance', url: 'https://web.dev/articles/rendering-performance' },
          {
            label: 'PerformanceObserver',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver',
          },
        ],
      },
      en: {
        title: 'Browser rendering performance',
        description: 'Diagnose layout thrashing, long tasks, and visual instability.',
        problem:
          'Typing and scrolling are janky: a loop reads geometry after writing styles, large components repaint frequently, and late content shifts the page. Build an evidence-based profiling plan, correct the ordering of DOM operations, and add observation without claiming improvements that were not measured.',
        examples: [
          'Bad loop: element.style.width = ...; element.getBoundingClientRect().width.',
          'Good frame: perform all reads before all writes inside requestAnimationFrame.',
        ],
        requirements: [
          'Explain style → layout → paint → composite and locate forced synchronous layout in a trace.',
          'Batch reads and writes per frame; do not treat a timer as a frame-rate guarantee.',
          'Observe long tasks/layout shifts and define a reproducible performance budget as a target.',
        ],
        hints: [
          'Record a Performance trace with CPU throttling and an identical flow; inspect long tasks, Layout events, and forced-reflow markers.',
          'Alternating writes and reads invalidates layout; a reads-before-writes queue lets the browser calculate it once.',
          'Prefer transform/opacity for animation, reserve media dimensions, and verify the result on the target device.',
        ],
        solution: {
          blocks: [{ label: 'Scheduler and observation', language: 'ts', code: renderingSolution }],
          alternative: [
            'CSS containment and content-visibility can narrow work but require accessibility and sizing validation.',
            'A Web Worker moves computation but cannot access the DOM and does not repair expensive layout.',
          ],
        },
        explanation: [
          'JavaScript can invalidate styles, and a later geometry read forces the browser to synchronously finish style/layout before returning a value.',
          'PerformanceObserver supports field telemetry for available entry types; a DevTools trace is still needed to connect cost to specific code.',
        ],
        edgeCases: [
          'Entry-type support varies; check PerformanceObserver.supportedEntryTypes.',
          'requestAnimationFrame is throttled or paused in a background tab.',
          'Transforms reduce layout/paint work, but excessive layers consume GPU memory.',
        ],
        complexity: [
          'The scheduler executes O(r + w) jobs per frame and empties both arrays after execution.',
        ],
        followUps: [
          'How do you distinguish a layout-bound flow from a script-bound one?',
          'When can debounce worsen INP while frame scheduling helps?',
          'How do image and font dimensions prevent CLS?',
        ],
        production: [
          'Fix the device, throttling, and scenario; a possible target is no tasks above 50 ms and no unexpected layout shifts, but publish only actually measured outcomes.',
        ],
        furtherReading: [
          { label: 'Rendering performance', url: 'https://web.dev/articles/rendering-performance' },
          {
            label: 'PerformanceObserver',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver',
          },
        ],
      },
    },
  },
] as const;
