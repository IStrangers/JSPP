import { AstNode, CommentAstNode, DelimiterAstNode, ElementAstNode, TextAstNode } from "./ast"
import { removeExtraSpaces } from "../util"

interface ParseOptions {
  delimiters: {
    open: string
    close: string
  }
}

interface ParseContext {
  content : string,
  options : ParseOptions,
  isEnd: Function,
  isElement: Function,
  isDelimiter: Function,
  isComment: Function,
  isText: Function,
  forward: Function,
  parseElement: Function,
  parseDelimiter: Function,
  parseComment: Function,
  parseText: Function,
}

function createDefaultParseOptions() : ParseOptions {
  return {
    delimiters: {
      open:"{{",
      close:"}}"
    }
  }
}

function createParseContext(content : string,options : ParseOptions) : ParseContext {
  return {
    content,
    options,
    isEnd: function() : boolean {
      return this.content.length > 0
    },
    isElement: function() : boolean {
      return this.content.startsWith("<")
    },
    isDelimiter: function() : boolean {
      return this.content.startsWith(this.options.delimiters.open)
    },
    isComment: function() : boolean {
      return this.content.startsWith("<!--")
    },
    isText: function() : boolean {
      return true
    },
    forward: function(length : number = 1) : void {
      this.content = this.content.slice(length)
    },
    parseElement: function() : ElementAstNode {
      return {

      }
    },
    parseDelimiter: function() : DelimiterAstNode {
      return {

      }
    },
    parseComment: function() : CommentAstNode {
      return {

      }
    },
    parseText: function() : TextAstNode {
      return {

      }
    }
  }
}

function parse(content : string,options? : ParseOptions) : Array<AstNode> {
  if(!content) {
    return []
  }
  if(!options) {
    options = createDefaultParseOptions()
  }
  const astNodes : Array<AstNode> = []
  const parseContext : ParseContext = createParseContext(removeExtraSpaces(content),options)
  while(!parseContext.isEnd()) {
    let astNode : AstNode;
    if(parseContext.isElement()) {
      astNode = parseContext.parseElement()
    } else if(parseContext.isDelimiter()) {
      astNode = parseContext.parseDelimiter()
    } else if(parseContext.isComment()) {
      astNode = parseContext.parseComment()
    } else {
      astNode = parseContext.parseText()
    }
    astNodes.push(astNode)
  }
  return astNodes
}

export {
  ParseOptions,
  parse
}