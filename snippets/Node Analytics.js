var y = f => (x => x(x))(x => f(y => x(x)(y)))

// Use as: y((recurse) => (n) => n === 0 ? 1 : n * recurse(n - 1))(6)

Array.prototype.flatMap = function(iterator) {
    return [].concat(...this.map(iterator));
}

var countNodes = (root) => y((recurse) => (el) => 1 + Array.from(el.childNodes).map((child) => recurse(child)).reduce((count1, count2) => count1 + count2, 0))(root);
var sortNodesByBreadth = (root) => y((recurse) => (el) => [[el, el.childNodes.length]].concat(Array.from(el.childNodes).flatMap((child) => recurse(child))))(root).sort(([el1, breadth1], [el2, breadth2]) => breadth2 - breadth1);
var sortNodesByDepth = (root) => y((recurse) => ([el, depth]) => el.childNodes.length === 0 ? [[el, depth]] : Array.from(el.childNodes).flatMap((child) => recurse([child, depth + 1])))([root, 0]).sort(([el1, depth1], [el2, depth2]) => depth2 - depth1);

var countNodesSanely = (el) => {
    return 1 /* self */ + Array.from(el.childNodes) /* children */
        .map((child) => countNodesSanely(child))
        .reduce((leftCount, rightCount) => leftCount + rightCount)
    ;
};