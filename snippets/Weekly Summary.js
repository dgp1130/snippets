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
