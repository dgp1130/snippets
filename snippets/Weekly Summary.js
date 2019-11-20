/**
 * Bookmarklet which opens up a Github search for all commits by an individual
 * for particular repository in the last 7 days. This is useful to get a weekly
 * summary of code contributions. Use this by copy-pasting it into a new
 * bookmark URL prefixed with `javascript:` to invoke this when that bookmark is
 * clicked.
 *
 * Consider changing the arguments to the function to change the user or repo
 * being referenced.
 */

(function (user, repo) {
    if (!user || !repo) throw new Error('Must provide a user and repo as arguments.');

    function toDateQueryString(date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    const date = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const url = `https://github.com/${repo}/commits?author=${
        encodeURIComponent(user)
    }&since=${
        encodeURIComponent(toDateQueryString(oneWeekAgo))
    }`;

    window.open(url);
}('dgp1130', 'angular/angular'));
