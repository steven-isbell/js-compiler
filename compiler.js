function lexicalAnalyzer(str) {
  return str
    .split(" ")
    .map(s => s.trim())
    .filter(s => s.length);
}

const Op = Symbol("op");
const Num = Symbol("num");

function parser(tokens) {
  let c = 0;

  const peek = () => tokens[c];
  const consume = () => tokens[c++];

  const parseNum = () => ({ val: parseInt(consume()), type: Num });

  const parseOp = () => {
    const node = { val: consume(), type: Op, expr: [] };
    while (peek()) node.expr.push(parseExpr());
    return node;
  };

  const parseExpr = () => (/\d/.test(peek()) ? parseNum() : parseOp());

  return parseExpr();
}
