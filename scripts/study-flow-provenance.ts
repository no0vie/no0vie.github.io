import { readFileSync } from 'node:fs';
import { learningSessionsSchema } from '../src/content/study-flow';
import { preparationTopics } from '../src/content/preparation';
import { interviewExercises } from '../src/content/interview';
import { algorithmPatterns } from '../src/content/algorithmic-patterns';

// Registry metadata is read only during validation; legacy source files are never imported.
function fragmentRegistry() {
  const registry = readFileSync(
    new URL('../docs/study-flow/legacy-examples-registry.md', import.meta.url),
    'utf8',
  );
  const revision = /Audit date: (\d{4}-\d{2}-\d{2})/.exec(registry)?.[1];
  if (!revision) throw new Error('Legacy fragment registry has no snapshot revision');
  const files = new Map<string, { path: string; sha256: string }>();
  for (const match of registry.matchAll(
    /^\| (F\d{2}) \| `([^`]+)`\s+\|[^\n]*?`([a-f0-9]{64})` \|$/gm,
  )) {
    files.set(match[1], { path: match[2], sha256: match[3] });
  }
  const fragments = new Map<
    string,
    { path: string; sha256: string; startLine: number; endLine: number; snapshotRevision: string }
  >();
  for (const match of registry.matchAll(/^\| (legacy-(F\d{2})-[a-z]) \| (\d+)[–-](\d+)\s+\|/gm)) {
    const file = files.get(match[2]);
    if (!file) throw new Error(`Missing registry file metadata for ${match[1]}`);
    fragments.set(match[1], {
      ...file,
      startLine: Number(match[3]),
      endLine: Number(match[4]),
      snapshotRevision: revision,
    });
  }
  if (files.size !== 26 || fragments.size !== 93)
    throw new Error(
      `Incomplete fragment registry: ${files.size} files, ${fragments.size} fragments`,
    );
  return fragments;
}

export function validateStudyFlowProvenance(input: unknown): void {
  const sessions = learningSessionsSchema.parse(input);
  const sources = {
    topic: new Set(preparationTopics.map(({ id }) => id)),
    exercise: new Set(interviewExercises.map(({ id }) => id)),
    pattern: new Set<string>(algorithmPatterns.map(({ id }) => id)),
  };
  let fragments: ReturnType<typeof fragmentRegistry> | undefined;
  for (const session of sessions) {
    const references = [
      ...session.sourceTopicIds.map((id) => ({ kind: 'topic' as const, id })),
      ...session.sourceExerciseIds.map((id) => ({ kind: 'exercise' as const, id })),
      ...session.sourceReferences,
    ];
    for (const reference of references) {
      if (reference.kind === 'fragment') {
        fragments ??= fragmentRegistry();
        const metadata = {
          path: reference.path,
          sha256: reference.sha256,
          startLine: reference.startLine,
          endLine: reference.endLine,
          snapshotRevision: reference.snapshotRevision,
        };
        const { id } = reference;
        const registered = fragments.get(id);
        if (
          !registered ||
          Object.keys(metadata).some(
            (key) =>
              metadata[key as keyof typeof metadata] !== registered[key as keyof typeof registered],
          )
        )
          throw new Error(`Session ${session.id}: unknown or mismatched fragment ${id}`);
      } else if (!sources[reference.kind].has(reference.id)) {
        throw new Error(`Session ${session.id}: unknown ${reference.kind} source ${reference.id}`);
      }
    }
    for (const kind of ['topic', 'exercise'] as const) {
      const oldIds = kind === 'topic' ? session.sourceTopicIds : session.sourceExerciseIds;
      for (const id of oldIds)
        if (!session.sourceReferences.some((ref) => ref.kind === kind && ref.id === id))
          throw new Error(`Session ${session.id}: legacy ${kind} ${id} missing typed reference`);
    }
  }

  const byId = new Map(sessions.map((session) => [session.id, session]));
  const visited = new Set<string>();
  const visiting = new Set<string>();
  function visit(id: string, path: string[]): void {
    if (visiting.has(id)) throw new Error(`Prerequisite cycle: ${[...path, id].join(' -> ')}`);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const prerequisite of byId.get(id)!.prerequisiteSessionIds) {
      if (!byId.has(prerequisite))
        throw new Error(`Session ${id}: unknown prerequisite ${prerequisite}`);
      visit(prerequisite, [...path, id]);
    }
    visiting.delete(id);
    visited.add(id);
  }
  for (const session of sessions) visit(session.id, []);
}
