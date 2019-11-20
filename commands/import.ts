import {promises as fs} from 'fs';
import {Snippet} from '../models/snippet';

/**
 * Imports the given snippets JSON to the Git repository in the current working
 * directory.
 */
export async function importSnippets(...args: string[]) {
  const [input] = args;
  await importSnippetsFile(input);
}

async function importSnippetsFile(file: string) {
  // Parse input file which has been exported from Chrome DevTools.
  const json = await fs.readFile(file, { encoding: 'utf8' });
  const snippets: unknown = JSON.parse(json);

  // Validate input JSON.
  if (!Array.isArray(snippets)) {
    throw new Error('Expected JSON import to be an array:\n'
        + JSON.stringify(snippets).substr(0, 10));
  }
  const snippetsArray: unknown[] = snippets;

  for (const snippetData of snippetsArray) {
    // Continue validating input JSON.
    if (typeof snippetData !== 'object') {
      throw new Error('Expected snippet to be an object:\n'
          + JSON.stringify(snippetData).substr(0, 10));
    }
    const snippetRecord = snippetData as Record<string, unknown>;

    const {name, content} = snippetRecord;
    if (typeof name !== 'string') {
      throw new Error('Expected snippet name to be a string: '
          + JSON.stringify(name));
    }
    if (typeof content !== 'string') {
      throw new Error('Expected snippet content to be a string: '
          + JSON.stringify(content));
    }

    const snippet = Snippet.fromSnippetData({ name, content });
    await importSnippet(snippet);
  }
}

async function importSnippet(snippet: Snippet) {
  const fileData = snippet.toFileData();
  await fs.writeFile(`snippets/${fileData.fileName}`, fileData.content);
}
