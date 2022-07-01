interface AstNode {
}

interface ElementAstNode extends AstNode {
  tag : string
  isSelfClosing: boolean
  isComponent : boolean
  attribute : Array<string>
  childrenAstNode : Array<AstNode>
}

interface TextAstNode extends AstNode {
  content : string
}

interface CommentAstNode extends AstNode {
  content : string
}

interface InterpolationAstNode extends AstNode {
  expression : string
}

export {
  AstNode,
  ElementAstNode,
  TextAstNode,
  CommentAstNode,
  InterpolationAstNode,
}