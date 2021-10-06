/**
 * Bookmarklet which opens up a GitHub URL for an issue or PR based on the input
 * number. This prompts for the user to give a repository and an issue number
 * (delimited by a space) and then opens that issue.
 *
 * Use this by copy-pasting it into a new bookmark URL with (please note the
 * escaped closing `<script>` tag in this comment, use a real closing tag in the
 * actual bookmarklet):
 * `data:text/html,<html><head><title>Jump to GitHub Issue</title></head><body><script>${snippet}<\/script></body></html>`
 *
 * Most bookmarklets use `javascript:` to execute, however this needs a new page
 * context because the `chrome://newtab` page refuses to executed bookmarklets
 * and that is the primary use case for this snippet.
 */

(async () => {
  /**
   * Wait until the tab is visible. This is because there are two use cases for
   * this bookmarklet:
   * 1. The user left-clicked it to navigate within an existing tab.
   * 2. The user middle-clicked it to navigate in a new tab.
   *
   * The `prompt()` and `alert()` functions require the document to be visible
   * to show to the user, therefore in the second case we need to wait for the
   * user to click on the new tab before prompting.
   */
  function waitUntilVisible() {
    return new Promise((resolve) => {
       if (document.visibilityState !== 'hidden') {
        /* Opened in same tab and is already visible. */
        resolve();
      } else {
        /**
         * Opened in new tab and is not visible, listen for the page to become
         * visible from the user clicking on the tab.
         */
        function onVisibilityChange() {
          if (document.visibilityState === 'hidden') return;

          resolve();
          document.removeEventListener('visibilitychange', onVisibilityChange);
        }
        document.addEventListener('visibilitychange', onVisibilityChange);
      }
    });
  }

  await waitUntilVisible();

  const respositoryMap = new Map(Object.entries({
    'ng': 'angular/angular',
    'ng-cli': 'angular/angular-cli',
    'components': 'angular/components',
    'protractor': 'angular/protractor',
  }));
  const defaultRepo = 'ng';

  const input = prompt(`What issue/PR do you want to open? Please input a repository name followed by a space, followed by a number. Possible repository names include:\n${
      Array.from(respositoryMap.keys()).join(', ')}`);

  const [ repoName, issueNumber ] = input.includes(' ')
    ? input.split(' ')
    : [ defaultRepo, input ];

  const repo = respositoryMap.get(repoName);
  if (!repo) {
    alert(`Unknown repository "${repoName}". Available options are:\n${
      Array.from(respositoryMap.keys()).join(', ')}`);
    return;
  }
  const issue = parseInt(issueNumber);
  if (isNaN(issue)) {
    alert(`Failed to parse ${
        issueNumber} as an integer, it should be a GitHub issue number.`);
    return;
  }

  location.href = `https://github.com/${repo}/issues/${issue}`;
})();
