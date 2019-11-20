/**
 * Lambda calculus implementation of a Y-combinator. No practical usage here,
 * just having a little fun.
 */

var y = f => (x => x(x))(x => f(y => x(x)(y)))

// Use as: y((recurse) => (n) => n === 0 ? 1 : n * recurse(n - 1))(6)
