export const interviewExerciseManifest = [
  { id: '01', slug: 'event-loop-execution-order' },
  { id: '02', slug: 'implement-promise-all' },
  { id: '03', slug: 'concurrency-limiter' },
  { id: '04', slug: 'production-ready-debounce' },
  { id: '05', slug: 'autocomplete-race-conditions' },
  { id: '06', slug: 'discriminated-union-state' },
  { id: '07', slug: 'type-safe-polymorphic-button' },
  { id: '08', slug: 'generic-group-by-index-by' },
  { id: '09', slug: 'diagnose-memory-leak' },
  { id: '10', slug: 'rendering-100000-items' },
  { id: '11', slug: 'reactive-store' },
  { id: '12', slug: 'browser-rendering-performance' },
  { id: '13', slug: 'frontend-security-review' },
  { id: '14', slug: 'resumable-large-file-upload' },
  { id: '15', slug: 'realtime-messaging-system' },
] as const;

export const interviewExerciseSlugs = interviewExerciseManifest.map(({ slug }) => slug);
