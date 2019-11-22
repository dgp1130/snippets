import {Language, getExtension} from '../models/language';
import assertNever from 'assert-never';

/** Represents a Chrome DevTools snippet exported as JSON. */
export interface SnippetData {
  name: string;
  content: string;
}

interface FileData {
  fileName: string;
  content: string;
}

/** Represents a Snippet from Chrome DevTools. */
export class Snippet {
  readonly name: string;
  readonly content: string;
  readonly language: Language;

  private constructor({name, content, language}: {
    name: string,
    content: string,
    language: Language,
  }) {
    this.name = name;
    this.content = content;
    this.language = language;
  }

  /** Creates a {@link Snippet} object from the given JSON data. */
  static fromSnippetData({name, content}: SnippetData): Snippet {
    const isTypeScript = name.endsWith(' TypeScript');
    return new Snippet({
      name: isTypeScript ? name.replace(/ TypeScript$/, '') : name,
      content,
      language: isTypeScript ? Language.TYPESCRIPT : Language.JAVASCRIPT,
    });
  }

  /** Creates a {@link Snippet} object from the given file data. */
  static fromFileData({fileName, content}: FileData): Snippet {
    const isTypeScript = fileName.endsWith('.ts');
    return new Snippet({
      name: fileName.replace(/.[^.]*$/, ''),
      content,
      language: isTypeScript ? Language.TYPESCRIPT : Language.JAVASCRIPT,
    });
  }

  /** Converts this {@link Snippet} to structured data for a file. */
  toFileData(): FileData {
    return {
      fileName: `${this.name}.${getExtension(this.language)}`,
      content: this.content,
    };
  }

  /** Converts this {@link Snippet} to structured data for a snippet. */
  toSnippetData(): SnippetData {
    const name = (() => {
      switch (this.language) {
        case Language.JAVASCRIPT: return this.name;
        case Language.TYPESCRIPT: return `${this.name} TypeScript`;
        default: return assertNever(this.language);
      }
    })();

    return {
      name,
      content: this.content,
    };
  }
}
