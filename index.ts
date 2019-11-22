import {importSnippets} from './commands/import';
import {exportSnippets} from './commands/export';

(async () => {
  // Parse command and arguments.
  const [, , command, ...args] = process.argv;

  // Execute requested command.
  try {
    switch (command) {
      case 'import':
        await importSnippets(...args);
        break;
      case 'export':
        await exportSnippets(...args);
        break;
      default: throw new Error(`Unknown command: ${command}.`);
    }
  } catch (err) {
    // Report error and abort.
    console.error(err);
    process.exit(1);
  }
})();
