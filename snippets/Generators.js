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