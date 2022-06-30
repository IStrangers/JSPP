enum AstType {
  ELEMENT,
  TEXT,
  COMMENT,
  DELIMITER,
}

interface Ast {
  type : AstType
}

interface ElementAst extends Ast {
  tag : string
  attribute : Array<string>
}

interface TextAst extends Ast {
  content : string
}

interface CommentAst extends Ast {
  content : string
}

interface DelimiterAst extends Ast {
  expression : string
}

export {
  Ast,
  ElementAst,
  TextAst,
  CommentAst,
  DelimiterAst,
}