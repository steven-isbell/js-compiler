const fs = require("fs");
// Utility for applying functions to input
const { pipe } = require("./utils");

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
    /* Builds AST
    While there's tokens, parse them
    if it's another operation, create another sub node tree
    */
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
  const opMap = { sum: "+", mul: "*", sub: "-", div: "/", exp: "**" };
  const transpileNode = ast =>
    ast.type === Num ? transpileNum(ast) : transpileOp(ast);
  const transpileNum = ast => ast.val;
  const transpileOp = ast => {
    // if the operation is invalid, throw
    if (!opMap[ast.val]) {
      const supOps = Object.keys(opMap);
      const supOpsList = supOps
        .concat(supOps.splice(-2, 2).join(" & "))
        .join(", ");
      throw new SyntaxError(
        `The operation "${
          ast.val
        }" is invalid. Currently ${supOpsList} are supported`
      );
    }
    return `(${ast.expr.map(transpileNode).join(" " + opMap[ast.val] + " ")})`;
  };
  return transpileNode(ast);
}

// const program = "mul 3 5 sub 2 sum 1 3 4 exp 5 8";

// Read in some text file
fs.readFile("./sampleInput.txt", "utf8", function(err, data) {
  if (err) {
    throw new Error(err);
  }
  // Parse each line, filtering out new line whitespace
  const parsed = data
    .split("\n")
    .filter(Boolean)
    .map(pipeline)
    .join("\n");
  // Write to output file
  fs.writeFileSync("sampleOutput.js", parsed);
});

// Output the expression and it's resolved output
function pipeline(val) {
  const output = pipe(
    lexicalAnalyzer,
    parser,
    transpile
  )(val);
  // Eval is used because this is an interpreter
  return `${output}
"The expression resolves to ${eval(output)}"`;
}
