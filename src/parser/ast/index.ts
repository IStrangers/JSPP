interface AstNode {
}

interface ElementAttribute {
  name : string
  value : any
}

interface ElementAstNode extends AstNode {
  tag : string
  isSelfClosing: boolean
  isComponent : boolean
  attribute : Array<ElementAttribute>
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
  ElementAttribute,
  ElementAstNode,
  TextAstNode,
  CommentAstNode,
  InterpolationAstNode,
}