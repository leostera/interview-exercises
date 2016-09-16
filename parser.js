var util = require('util')

var keywords = [
  "function",
  "return",
]

var f = "function wat ( ) { return 40 } function hello () { } function test ( ) { return 2 }".split(" ")

var output = [{
  type: "function_declaration",
  name: "test",
  body: [ {
    type: "statement_return",
    args: [{
      type: "literal_number",
      value: 2
    }]
  }]
}]

var parsers = {
  "function": function (tail) {
    var name = tail.shift()
    parsers["function_arguments"](tail)
    return {
      type: "function_declaration",
      name: name,
      body: parsers["block"](tail)
    }
  },

  "function_arguments": function(tail) {
    tail.shift()
    tail.shift()
  },

  "block": function(tail) {
    var open_brace = tail.shift()
    var ast = {};
    if(open_brace == "{") {
      ast = parse(tail)
    }
    var closing_brace = tail.shift();
    if (closing_brace !== "}") {
      tail.unshift(closing_brace);
    }
    return ast;
  },

  "return": function(tail) {
    return {
      type: "statement_return",
      args: [{
        type: "literal_number",
        value: tail[0]
      }]
    }
  }

}


function parse(tokens, ast) {
  ast = ast || []
  var token = tokens.shift()
  if ( is_keyword(token) ) {
    ast.push(parsers[token](tokens))
  }
  return tokens.length === 0 ? ast : parse(tokens, ast)
}

function is_keyword(token) {
  return keywords.indexOf(token) !== -1
}


console.log(util.inspect(f))
console.log(util.inspect(parse(f), false, null))
