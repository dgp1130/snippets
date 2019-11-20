# Snippets

Set of "snippets" loaded in Chrome DevTools. Some do useful things which can be
run on demand, others and just random pieces of code while I was
prototyping/debugging something. Some are written in TypeScript and can't be
executed directly in the browser snippets windows. You need to run these in the
[TypeScript playground](http://www.typescriptlang.org/play/).

## Dependencies

* [Node](https://nodejs.org/)
* [Node Package Manager](https://npmjs.com/)

Just run:

```shell
npm install
```

## Import/Export

See [this Stack Overflow answer](https://stackoverflow.com/a/35002464).

TL;DR: Open a DevTools-on-DevTools window by opening DevTools _undocked_, and
then press `Ctrl+Shift+I` to inspect it with a second DevTools window. The
console in this second window should have access to the `InspectorFrontendHost`
API.

### Import

To import snippets from Chrome DevTools to this Git repository, you must first
export the data from Chrome. Execute in the DevTools-on-DevTools console:

```javascript
InspectorFrontendHost.getPreferences((prefs) => console.log(JSON.stringify(JSON.parse(prefs.scriptSnippets), null /* replacer */, 4 /* tabSize */)));
```

Then copy paste the output to a JSON file and run:

```shell
npm start import <file.json>
```

This will update the `snippets/` directory with all the content. You can then
commit and push the snippets.

### Export

To export from this repository to Chrome DevTools, run:

```shell
npm start export
# Consider piping this into the relevant copy script to put stdout on the clipboard.
```

Then copy the output and execute in the DevTools-on-DevTools window:

```javascript
InspectorFrontendHost.setPreference('scriptSnippets', '<paste-snippets>');
```
