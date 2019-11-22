import {promises as fs} from 'fs';
import * as path from 'path';
import {Snippet} from '../models/snippet';

const snippetsRoot = 'snippets/';

/**
 * Exports the files under snippets/ as Snippets JSON to be loaded into Chrome
 * DevTools.
 */
export async function exportSnippets(...args: string[]) {
  // Read all stored snippets file content in parallel.
  const snippetFileNames = await fs.readdir(snippetsRoot);
  const snippetFiles = snippetFileNames
      .map((fileName) => fs.readFile(path.join(snippetsRoot, fileName), {
        encoding: 'utf8',
      }).then((content) => ({fileName, content})))
  ;

  // Convert the snippet file data into the relevant format for Chrome Dev Tools.
  const snippetsFileData = await Promise.all(snippetFiles);
  const snippetsData = snippetsFileData
      .map((fileData) => Snippet.fromFileData(fileData))
      .map((snippetData) => snippetData.toSnippetData());
  const json = JSON.stringify(snippetsData);

  // URL escape the JSON data. This replaces any double quotes so it would be
  // mis-interpreted by JavaScript when pasted into the Console.
  const escaped = encodeURIComponent(json);

  // Output the full command to e pasted into a DevTools console.
  process.stdout.write(`
InspectorFrontendHost.getPreferences((prefs) => {
  const existingSnippets = JSON.parse(prefs.scriptSnippets).reduce((snippets, {name, content}) => ({...snippets, [name]: content}), {});
  const newSnippets = JSON.parse(decodeURIComponent("${escaped}")).map(({name, content}) => ({[name]: content}));
  const combined = Object.assign({}, existingSnippets, ...newSnippets);
  const list = Object.entries(combined).map(([name, content]) => ({name, content}));
  InspectorFrontendHost.setPreference('scriptSnippets', JSON.stringify(list));
});
`.trim());
}
