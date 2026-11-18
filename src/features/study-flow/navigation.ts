export type StudyMode = 'learn' | 'recognize' | 'solve';

export interface StudyFlowLocation {
  cardId: string;
  seed: number;
  mode: StudyMode;
  needsCanonicalization: boolean;
}

const DEFAULT_SEED = 1;
const MAX_SEED = 2_147_483_647;

function parseSeed(value: string | null): number {
  if (!value || !/^\d+$/.test(value)) return DEFAULT_SEED;
  const seed = Number(value);
  return Number.isSafeInteger(seed) && seed >= 0 && seed <= MAX_SEED ? seed : DEFAULT_SEED;
}

function parseMode(value: string | null): StudyMode {
  return value === 'recognize' || value === 'solve' ? value : 'learn';
}

export function parseStudyFlowLocation(
  search: string,
  cardIds: readonly string[],
  persistedCardId?: string,
): StudyFlowLocation {
  if (cardIds.length === 0) throw new Error('A Study Flow session must contain at least one card');
  const params = new URLSearchParams(search);
  const requestedCardId = params.get('card');
  const cardId = requestedCardId
    ? cardIds.includes(requestedCardId)
      ? requestedCardId
      : cardIds[0]
    : persistedCardId && cardIds.includes(persistedCardId)
      ? persistedCardId
      : cardIds[0];
  const seed = parseSeed(params.get('seed'));
  const mode = parseMode(params.get('mode'));
  const seedValue = params.get('seed');
  const modeValue = params.get('mode');
  const needsCanonicalization =
    requestedCardId !== cardId ||
    seedValue === null ||
    String(seed) !== seedValue ||
    (mode === 'learn' ? modeValue !== null : modeValue !== mode);

  return { cardId, seed, mode, needsCanonicalization };
}

export function createStudyFlowUrl(
  pathname: string,
  state: Pick<StudyFlowLocation, 'cardId' | 'seed' | 'mode'>,
): string {
  const params = new URLSearchParams({ card: state.cardId, seed: String(state.seed) });
  if (state.mode !== 'learn') params.set('mode', state.mode);
  return `${pathname}?${params.toString()}`;
}
