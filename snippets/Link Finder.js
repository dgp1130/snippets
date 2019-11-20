/**
 * Looks for all links present on a page and prints them. Useful for aggregating
 * all the links on a suspicious page to verify potential phishing. Since links
 * can be implemented in JavaScript, this won't catch every link, but can be a
 * starting point.
 */

function* findLinks(el) {
    if (el.getAttributeNames) { // HTML comments don't have attributes.
        for (const attr of el.getAttributeNames()) {
            let url;
            try {
                url = new URL(el.getAttribute(attr));
            } catch {
                continue; // Not a URL, ignore.
            }

            yield url;
        }
    }

    // Custom elements hold their children on their shadowRoot.
    const root = el.shadowRoot ? el.shadowRoot : el;

    // Slots hold their children on assignedNodes().
    const children = root.assignedNodes ? root.assignedNodes() : root.childNodes;

    // Recurse over all children.
    for (const child of children) {
        yield* findLinks(child);
    }
}

var links = new Set(Array.from(findLinks(document.documentElement))
    .filter((url) => url.protocol === 'http:' || url.protocol === 'https:')
    .sort((l, r) => l.hostname.localeCompare(r.hostname))
    .map((url) => url.toString()));

for (const link of links) {
    console.log(link);
}
