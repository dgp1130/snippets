/**
 * JavaScript implementation of a generator function with a return value. The
 * original idea was that a function could `yield` any logs it had, while it
 * would `return` the meaningful value.
 */

function generatorWithReturn(gen) {
    return () => {
        return new GeneratorResult(gen());
    };
}

class GeneratorResult {
    constructor(iterable) {
        this.iterable = iterable;
        this.result = null;
    }

    *[Symbol.iterator]() {
        let curr = this.iterable.next();
        while (!curr.done) {
            yield curr.value;
            curr = this.iterable.next();
        }
        this.result = curr.value;
    }
}

const generator = generatorWithReturn(function* () {
    yield 0;
    yield 1;
    yield 2;
    yield 3;
    return 'hello';
});

const genResult = generator();
for (const value of genResult) {
    console.log(value);
}
console.log(genResult.result);

const genResult2 = generator();
for (const value of genResult2) {
    console.log(value);
}
console.log(genResult2.result);
