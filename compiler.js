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

  // if the token is a number, parse it
  const parseNum = () => {
    if (!isNaN(peek())) {
      throw new Error(`${peek()} is not a valid number`);
    }
    return { val: parseInt(consume(), 10), type: Num };
  };

  // if the token is an operation, parse it
  const parseOp = () => {
    const node = { val: consume(), type: Op, expr: [] };
    while (peek()) node.expr.push(parseExpr());
    return node;
  };

  // if the token is a number, parse as a number, else parse as an operation
  const parseExpr = () => (/\d/.test(peek()) ? parseNum() : parseOp());

  return parseExpr();
}
