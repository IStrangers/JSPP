enum AstNodeType {
  ELEMENT,
  TEXT,
  COMMENT,
  INTERPOLATION,
}

interface AstNode {
  nodeType : AstNodeType
}

interface ElementAttribute {
  name : string
  value : any
}

interface ElementDirective {
  name : string
  value : any
}

interface ElementAstNode extends AstNode {
  tag : string
  isSelfClosing: boolean
  isComponent : boolean
  attributes : Array<ElementAttribute>
  directives : Array<ElementDirective>
  childrenNode : Array<AstNode>
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
  AstNodeType,
  AstNode,
  ElementAttribute,
  ElementDirective,
  ElementAstNode,
  TextAstNode,
  CommentAstNode,
  InterpolationAstNode,
}