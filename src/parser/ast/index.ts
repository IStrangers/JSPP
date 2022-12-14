enum AstNodeType {
  ROOT_NODE,
  ELEMENT,
  TEXT,
  COMMENT,
  INTERPOLATION,
}

interface AstNode {
  parent : ElementAstNode
  nodeType : AstNodeType
}

interface ElementAttribute {
  name : string
  value : string
}

interface ElementDirective {
  name : string
  value : string
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