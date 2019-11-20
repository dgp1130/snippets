/**
 * Simple example of overloading `Symbol.iterator` to use a `for-of` loop to
 * iterate over a complex type.
 */

class Story {
    constructor(cards) {
        this.cards = cards;
    }

    *[Symbol.iterator]() {
        yield* this.cards;
    }
}

for (const card of new Story([1, 2, 3])) {
    console.log(card);
}
