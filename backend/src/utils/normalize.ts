import { remove as removeDiacritics } from 'diacritics';

export function normalizeCode(code: string): string {
  return removeDiacritics(code.trim().toLowerCase());
}
