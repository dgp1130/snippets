/**
 * Some fun I had with lambda calculus. This is a TypeScript implementation of
 * basic arithmetic and boolean logic using strict lambda calculus. The only
 * place I had to cheat was in the print functions.
 */

const output = document.createElement('div');
document.querySelector('body').appendChild(output);

function print(line: string = '') {
    output.innerText += line + '\n';
}

type Bool<X> = (tVal: X) => (fVal: X) => X;

const t = <X>(tVal: X) => (fVal: X) => tVal;
const f = <X>(tVal: X) => (fVal: X) => fVal;
const ifStmt = <X>(c: Bool<X>) => (tVal: X) => (fVal: X) => c(tVal)(fVal);

print(`true ? 0 : 1 = ${ifStmt(t)(0)(1)}`);
print(`false ? 0 : 1 = ${ifStmt(f)(0)(1)}`);
print();

const not = <X>(b: Bool<X>) => (tVal: X) => (fVal: X) => b(fVal)(tVal);
const and = <X>(a: Bool<X>) => (b: Bool<X>) => (tVal: X) => (fVal: X) => a(b(tVal)(fVal))(fVal);
const or = <X>(a: Bool<X>) => (b: Bool<X>) => (tVal: X) => (fVal: X) => a(tVal)(b(tVal)(fVal));

function boolToString(b: Bool<any>): string {
    return (b(0)(1) === 0).toString();
}

print(`not false = ${boolToString(not(f))}`);
print(`not true = ${boolToString(not(t))}`);
print();

print(`false and false = ${boolToString(and(f)(f))}`);
print(`false and true = ${boolToString(and(f)(t))}`);
print(`true and false = ${boolToString(and(t)(f))}`);
print(`true and true = ${boolToString(and(t)(t))}`);
print();

print(`false or false = ${boolToString(or(f)(f))}`);
print(`false or true = ${boolToString(or(f)(t))}`);
print(`true or false = ${boolToString(or(t)(f))}`);
print(`true or true = ${boolToString(or(t)(t))}`);
print();

type Num<X> = (f: (x: X) => X) => (x: X) => X;

const next = <X>(n: Num<X>) => (f: (x: X) => X) => (x: X) => f(n(f)(x));
const zero = <X>(f: (x: X) => X) => (x: X) => x;
const one = next(zero);
const two = next(one);
const three = next(two);

function numToString(n: Num<any>): string {
    let count = 0;
    n(() => count++)(0);
    return count.toString();
}

print(`0 = ${numToString(zero)}`);
print(`1 = ${numToString(one)}`);
print(`2 = ${numToString(two)}`);
print(`3 = ${numToString(three)}`);
print();

const add = <X>(a: Num<X>) => (b: Num<X>) => (f: (x: X) => X) => (x: X) => a(f)(b(f)(x))
const mul = <X>(a: Num<X>) => (b: Num<X>) => (f: (x: X) => X) => (x: X) => b(a(f))(x);

print(`2 + 3 = ${numToString(add(two)(three))}`);
print(`2 * 3 = ${numToString(mul(two)(three))}`);
