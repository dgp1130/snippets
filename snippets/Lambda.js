var t = (x) => (y) => x;
var f = (x) => (y) => y;
var ifStmt = (c) => (tVal) => (fVal) => c(tVal)(fVal);

console.log(`true ? 0 : 1 = ${ifStmt(t)(0)(1)}`);
console.log(`false ? 0 : 1 = ${ifStmt(f)(0)(1)}`);

var next = (n) => (f) => (x) => f(n(f)(x));

var zero = (f) => (x) => x;
var one = next(zero);
var two = next(one);
var three = next(two);

function print(num) {
    let count = 0;
    num(() => count++)(0);
    return count;
}

console.log(`0 = ${print(zero)}`);
console.log(`1 = ${print(one)}`);
console.log(`2 = ${print(two)}`);
console.log(`3 = ${print(three)}`);

var add = (a) => (b) => (f) => (x) => a(f)(b(f)(x));
var mul = (a) => (b) => (f) => (x) => b(a(f))(x);
var pow = (a) => (b) => (f) => (x) => b(a)(f)(x);

console.log(`2 + 3 = ${print(add(two)(three))}`);
console.log(`2 * 3 = ${print(mul(two)(three))}`);
console.log(`2 ^ 3 = ${print(pow(two)(three))}`);