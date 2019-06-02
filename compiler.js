const Num = Symbol("num");
const Op = Symbol("op");

function parser(tokens) {
  let c = 0;

  const peek = () => tokens[c];
  const consume = () => tokens[c++];

  // if the token is a number, parse it
  const parseNum = () => {
    if (!isNaN(peek())) {
      throw new SyntaxError(`${peek()} is not a valid number`);
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

function lexicalAnalyzer(str) {
  return str
    .split(" ")
    .map(s => s.trim())
    .filter(s => s.length);
}

function transpile(ast) {
  const opMap = { sum: "+", mul: "*", sub: "-", div: "/" };
  const transpileNode = ast =>
    ast.type === Num ? transpileNum(ast) : transpileOp(ast);
  const transpileNum = ast => ast.val;
  const transpileOp = ast =>
    `(${ast.expr.map(transpileNode).join(" " + opMap[ast.val] + " ")})`;
  return transpileNode(ast);
}
