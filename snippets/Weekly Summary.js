/**
 * Bookmarklet which opens up a Github search for all PRs by an individual in
 * the last 7 days. This is useful to get a weekly summary of code
 * contributions. Use this by copy-pasting it into a new bookmark URL prefixed
 * with `javascript:` to invoke this when that bookmark is clicked.
 *
 * Consider changing the arguments to the function to change the user being
 * referenced.
 */

(function (user) {
    if (!user) throw new Error('Must provide a user argument.');

    /**
     * Transform the date into YYYY-MM-DD format (zero-padded which is actually
     * necessary for GitHub search). Values are 1-indexed to be human-readable.
     */
    function toDateQueryString(date) {
        return `${date.getFullYear()}-${
            (date.getMonth() + 1).toString().padStart(2, '0')}-${
            date.getDate().toString().padStart(2, '0')}`;
    }

    const date = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(date.getDate() - 7);

    const url = new URL(`https://github.com/search`);
    url.searchParams.set('q', `is:pr author:${user} closed:>${
        toDateQueryString(oneWeekAgo)}`);
    url.searchParams.set('type', 'Issues');

    window.location.href = url.toString();
}('dgp1130'));
