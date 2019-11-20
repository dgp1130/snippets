/**
 * TypeScript implementation of a Generator with a return value. Built-in types
 * actually already support this, but it is not very usable because calling
 * `for-of` drops the return type. This is intended as a more usable alternative
 * which avoids the need to call `.next()`.
 */

class GeneratorResult<YieldType, ReturnType, NextType = void> {
    public iterable: Generator<YieldType, void, NextType>;
    public result: ReturnType|null = null;

    constructor(iterable: Generator<YieldType, ReturnType, NextType>) {
        const self = this;
        this.iterable = function* () {
            let curr = iterable.next();
            while (!curr.done) {
                const next = yield curr.value;
                curr = iterable.next(next);
            }
            self.result = curr.value;
        }();
    }
}

function captureResult<TYield, TReturn, TNext>(
    iterable: Generator<TYield, TReturn, TNext>,
) {
    return new GeneratorResult(iterable);
}

function* generator() {
    yield 0;
    yield 1;
    yield 2;
    yield 3;
    return 'hello';
}

const genResult = captureResult(generator());
for (const value of genResult.iterable) {
    console.log(value);
}
console.log(genResult.result!);

const genResult2 = captureResult(generator());
for (const value of genResult2.iterable) {
    console.log(value);
}
console.log(genResult2.result!);

function* anotherGen() {
    const foo: string = yield;
    yield foo;
}

const genResult3 = captureResult(anotherGen());
genResult3.iterable.next();
console.log(genResult3.iterable.next('test').value);

class Log {
    constructor(
        public readonly message: string,
        public readonly error?: Error,
    ) { }

    toString() {
        if (!this.error) {
            return this.message;
        } else {
            return `${this.message} - ${this.error.message}`;
        }
    }
}

function* cliCommand(success: boolean) {
    yield new Log('Doing a thing');
    yield new Log('Doing risky thing.');

    if (!success) {
        yield new Log('Err: Done fucked up.', new Error('Strict nulls be damned!'));
        return 1;
    }

    yield new Log('One more thing.');
    return 0;
}

let willSucceed = false;
let success = false;
do {
    const genResult = captureResult(cliCommand(willSucceed));
    const logs: Log[] = [];
    for (const log of genResult.iterable) logs.push(log);
    if (genResult.result! !== 0) {
        console.log('Something went very wrong, dumping logs...');
        for (const log of logs) console.log(log.toString());
        console.log('Retrying...');
        willSucceed = true;
    } else {
        success = true;
        console.log('Success! No need to display logs. :D');
    }
} while (!success);

class MonadicLogger<T> {
    private constructor(
        public readonly result: T,
        public readonly logs: Log[] = [],
    ) { }

    public map<R>(mapper: (result: T) => R) {
        return new MonadicLogger(mapper(this.result), this.logs);
    }

    public flatMap<R>(mapper: (result: T) => Generator<Log, R, void>) {
        const genResult = captureResult(mapper(this.result));
        const newLogs: Log[] = [];
        for (const log of genResult.iterable) newLogs.push(log);
        return new MonadicLogger(genResult.result, this.logs.concat(newLogs));
    }

    public static log<T>(
        gen: Generator<Log, T, void>,
    ): MonadicLogger<T> {
        const genResult = captureResult(gen);
        const logs: Log[] = [];
        for (const log of genResult.iterable) logs.push(log);
        return new MonadicLogger(genResult.result!, logs);
    }
}

function* execute() {
    yield new Log('Test');
    yield new Log('Test 2');

    return 0;
}

function* secondExecution() {
    yield new Log('Trying a thing.');
    yield new Log('Trying another thing.');

    return 1;
}

(function () {
    const executeResult = MonadicLogger.log(execute());
    if (executeResult.result !== 0) {
        console.log('Error, check the logs!');
        for (const log of executeResult.logs) {
            console.log(log.toString());
        }
        return;
    }

    const secondResult = executeResult.flatMap(() => secondExecution());
    if (secondResult.result !== 0) {
        console.log('Error, check the logs!');
        for (const log of secondResult.logs) {
            console.log(log.toString());
        }
        return;
    }

    console.log('Success!');
}());
