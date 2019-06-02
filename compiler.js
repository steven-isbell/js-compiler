const Num = Symbol("num");
const Op = Symbol("op");

// Generates tokens for parsing
function lexicalAnalyzer(str) {
  return str
    .split(" ")
    .map(s => s.trim())
    .filter(s => s.length);
}

// parses input data
// receives tokens from analyzer
function parser(tokens) {
  let c = 0;

  const peek = () => tokens[c];
  const consume = () => tokens[c++];

  // if the token is a number, parse it
  const parseNum = () => {
    if (isNaN(peek())) {
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

  // returns AST
  return parseExpr();
}

// converts provided code into target code
// receives ast from parser
function transpile(ast) {
  const opMap = { sum: "+", mul: "*", sub: "-", div: "/" };
  const transpileNode = ast =>
    ast.type === Num ? transpileNum(ast) : transpileOp(ast);
  const transpileNum = ast => ast.val;
  const transpileOp = ast =>
    `(${ast.expr.map(transpileNode).join(" " + opMap[ast.val] + " ")})`;
  return transpileNode(ast);
}

const program = "mul 3 sub 2 sum 1 3 4";

console.log(transpile(parser(lexicalAnalyzer(program))));
