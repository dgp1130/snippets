import {assertNever} from 'assert-never';

/** Languages supported by snippets. */
export enum Language {
  TYPESCRIPT = 'typescript',
  JAVASCRIPT = 'javascript',
}

/** Converts a language to a file extension. */
export function getExtension(lang: Language): string {
  switch (lang) {
    case Language.TYPESCRIPT: return 'ts';
    case Language.JAVASCRIPT: return 'js';
    default: return assertNever(lang);
  }
}
