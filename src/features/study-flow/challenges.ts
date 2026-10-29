export interface EventLoopChallenge {
  templateId: 'event-loop-order';
  generatorVersion: 1;
  seed: number;
  timerLabel: string;
  microtaskLabel: string;
  nestedMicrotaskLabel: string;
  source: string;
  expectedOrder: string[];
}

function hash(seed: number): number {
  let value = seed | 0;
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return (value ^ (value >>> 16)) >>> 0;
}

export function generateEventLoopChallenge(seed: number): EventLoopChallenge {
  const value = hash(seed);
  const suffix = (value % 97) + 1;
  const timerLabel = `timer-${suffix}`;
  const microtaskLabel = `microtask-${(value >>> 7) % 89}`;
  const nestedMicrotaskLabel = `nested-${(value >>> 14) % 83}`;
  const timerFirstInSource = (value & 1) === 0;
  const sourceLines = timerFirstInSource
    ? [
        `setTimeout(() => console.log('${timerLabel}'), 0);`,
        `Promise.resolve().then(() => { console.log('${microtaskLabel}'); queueMicrotask(() => console.log('${nestedMicrotaskLabel}')); });`,
      ]
    : [
        `Promise.resolve().then(() => { console.log('${microtaskLabel}'); queueMicrotask(() => console.log('${nestedMicrotaskLabel}')); });`,
        `setTimeout(() => console.log('${timerLabel}'), 0);`,
      ];
  return {
    templateId: 'event-loop-order',
    generatorVersion: 1,
    seed,
    timerLabel,
    microtaskLabel,
    nestedMicrotaskLabel,
    source: [
      `console.log('sync-${suffix}');`,
      ...sourceLines,
      `console.log('end-${suffix}');`,
    ].join('\n'),
    expectedOrder: [
      `sync-${suffix}`,
      `end-${suffix}`,
      microtaskLabel,
      nestedMicrotaskLabel,
      timerLabel,
    ],
  };
}

export function validateEventLoopChallenge(instance: EventLoopChallenge): boolean {
  return (
    instance.templateId === 'event-loop-order' &&
    instance.generatorVersion === 1 &&
    instance.expectedOrder.length === 5 &&
    new Set(instance.expectedOrder).size === 5 &&
    instance.expectedOrder[2] === instance.microtaskLabel &&
    instance.expectedOrder[3] === instance.nestedMicrotaskLabel &&
    instance.expectedOrder[4] === instance.timerLabel
  );
}
