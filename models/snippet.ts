import {Language, getExtension} from '../models/language';

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
  static fromSnippetData(data: SnippetData): Snippet {
    const {name, content} = data;
    const isTypeScript = name.endsWith(' TypeScript');
    return new Snippet({
      name: isTypeScript ? name.replace(/ TypeScript$/, '') : name,
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
}
