/**
 * Prototype of a "colorizer" using tagged template literals to create an
 * intuitive API for color console output.
 */

function* buildConsoleString(fragments: TemplateStringsArray, ...placeholders: Color[]): IterableIterator<string> {
    for (let i = 0; i < fragments.length - 1; ++i) {
        yield fragments[i];
        yield `%c${placeholders[i].content}%c`;
    }
    yield fragments[fragments.length - 1];
}

function colorized(fragments: TemplateStringsArray, ...placeholders: Color[]): string[] {
    return [
        Array.from(buildConsoleString(fragments, ...placeholders)).join(''),
        ...placeholders.flatMap(({ color }) => [
            `color: ${color}`,
            'color: black',
        ]),
    ];
}

interface Color {
    color: string;
    content: string;
}

function color(c: string, content: string): Color {
    return {
        color: c,
        content: content,
    };
}

console.log(...colorized`Testing: ${color('blue', 'Hello')}, what a ${color('red', 'wonderful')} World!`);
