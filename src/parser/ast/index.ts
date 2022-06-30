interface AstNode {
}

interface ElementAstNode extends AstNode {
  tag : string
  attribute : Array<string>
}

interface TextAstNode extends AstNode {
  content : string
}

interface CommentAstNode extends AstNode {
  content : string
}

interface DelimiterAstNode extends AstNode {
  expression : string
}

export {
  AstNode,
  ElementAstNode,
  TextAstNode,
  CommentAstNode,
  DelimiterAstNode,
}