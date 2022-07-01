import { AstNode, CommentAstNode, InterpolationAstNode, ElementAttribute, ElementAstNode, TextAstNode, AstNodeType, ElementDirective } from "./ast"
import { isUppercaseStart,removeExtraSpaces } from "../util"

interface ParseOptions {
  isRemoveExtraSpaces: boolean
  delimiters: {
    commentStart: string,
    commentEnd: string,
    interpolationStart: string
    interpolationEnd: string
  }
}

interface ParseContext {
  content : string,
  options : ParseOptions,
  isEnd: Function,
  isElement: Function,
  isInterpolation: Function,
  isComment: Function,
  isSelfClosing: Function,
  forward: Function,
  removeSpaces: Function,
  parseElement: Function,
  parseElementTag: Function,
  parseElementAttribute: Function,
  parseElementChildrenAstNode: Function,
  parseInterpolation: Function,
  parseComment: Function,
  parseText: Function,
}

function createDefaultParseOptions() : ParseOptions {
  return {
    isRemoveExtraSpaces: true,
    delimiters: {
      commentStart: "<!--",
      commentEnd: "-->",
      interpolationStart:"{{",
      interpolationEnd:"}}"
    }
  }
}

function createParseContext(content : string,options : ParseOptions) : ParseContext {
  if(options.isRemoveExtraSpaces) {
    content = removeExtraSpaces(content)
  }
  return {
    content,
    options,
    isEnd: function() : boolean {
      return this.content.startsWith("</") || this.content.length === 0
    },
    isElement: function() : boolean {
      return this.content.startsWith("<")
    },
    isInterpolation: function() : boolean {
      return this.content.startsWith(this.options.delimiters.interpolationStart)
    },
    isComment: function() : boolean {
      return this.content.startsWith(this.options.delimiters.commentStart)
    },
    isSelfClosing: function(tag : string) : boolean {
      return [
        "area","base","br","col","embed",
        "hr","img","input","link","meta",
        "param","source","track","wbr"
      ].includes(tag)
    },
    forward: function(length : number = 1) : void {
      this.content = this.content.slice(length)
    },
    removeSpaces: function() : void {
      const match = /^[\n\r\t\f ]+/.exec(this.content)
      if(match) {
        this.forward(match[0].length)
      }
    },
    parseElement: function() : ElementAstNode {
      const tag = this.parseElementTag()
      const isComponent = isUppercaseStart(tag)
      const [attributes,directives] = this.parseElementAttribute()
      const isSelfClosing = this.content.startsWith("/>")
      this.forward(isSelfClosing ? 2 : 1)

      let childrenNode = []
      if(isSelfClosing == false) {
        childrenNode = this.parseElementChildrenAstNode()
        this.parseElementTag(true)
      }

      return {
        nodeType: AstNodeType.ELEMENT,
        tag,
        isSelfClosing,
        isComponent,
        attributes,
        directives,
        childrenNode
      }
    },
    parseElementTag: function(isCloseTag : boolean) : string {
      const match = /^<\/*([A-z][^\n\r\t\f />]*)/.exec(this.content)
      let tag = ""
      if(match) {
        tag = match[1]
        const length = match[0].length + (isCloseTag ? 1 : 0)
        this.forward(length)
        this.removeSpaces()
      }
      return tag
    },
    parseElementAttribute: function() : Array<Array<ElementAttribute> | Array<ElementDirective>> {
      const attributes : Array<ElementAttribute> = []
      const directives : Array<ElementDirective> = []
      const reg = /^[^\t\r\n\f />][^\t\r\n\f />=]*/
      while(!this.content.startsWith(">") && !this.content.startsWith("/>")) {
        const match = reg.exec(this.content)
        if(!match) {
          continue
        }
        const name = match[0]
        let value = null
        this.forward(match[0].length)
        this.removeSpaces()
        if(this.content.startsWith("=")) {
          this.forward(1)
          this.removeSpaces()
          let endIndex = 0;
          if(this.content.startsWith(`'`) || this.content.startsWith(`"`)){
            this.forward(1)
            endIndex = this.content.indexOf(`'`)
            endIndex = endIndex == -1 ? this.content.indexOf(`"`) : endIndex
          } else {
            continue
          }
          value = this.content.substring(0,endIndex).replace(/'"/g,"")
          this.forward(endIndex + 1)
        }
        this.removeSpaces()

        const isDirectives = name.startsWith("@") || name.startsWith("#")
        if(isDirectives) {
          directives.push({
            name,
            value
          })
        } else {
          attributes.push({
            name,
            value
          })
        }
      }
      return [attributes,directives]
    },
    parseElementChildrenAstNode: function() : Array<AstNode> {
      const astNodes : Array<AstNode> = []
      while(!this.isEnd()) {
        let astNode : AstNode;
        if(this.isElement()) {
          astNode = this.parseElement()
        } else if(this.isInterpolation()) {
          astNode = this.parseInterpolation()
        } else if(this.isComment()) {
          astNode = this.parseComment()
        } else {
          astNode = this.parseText()
        }
        astNodes.push(astNode)
      }
      return astNodes
    },
    parseInterpolation: function() : InterpolationAstNode {
      const {interpolationStart,interpolationEnd} = this.options.delimiters
      this.forward(interpolationStart.length)
      const endIndex = this.content.indexOf(interpolationEnd)
      const expression = this.content.substring(0,endIndex)
      this.forward(interpolationEnd.length)
      return {
        nodeType: AstNodeType.INTERPOLATION,
        expression
      }
    },
    parseComment: function() : CommentAstNode {
      const {commentStart,commentEnd} = this.options.delimiters
      this.forward(commentStart.length)
      const endIndex = this.content.indexOf(commentEnd)
      const content = this.content.substring(0,endIndex)
      this.forward(commentEnd.length)
      return {
        nodeType: AstNodeType.COMMENT,
        content
      }
    },
    parseText: function() : TextAstNode {
      const tokens = ["<",this.options.delimiters.interpolationStart]
      let endTextIndex = this.content.length;
      for(let i = 0; i < tokens.length; i++) {
        const index = this.content.indexOf(tokens[i])
        if(index != -1 && index < endTextIndex) {
          endTextIndex = index
        }
      }
      const content = this.content.substring(0,endTextIndex)
      this.forward(endTextIndex)
      return {
        nodeType: AstNodeType.TEXT,
        content
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
  const parseContext : ParseContext = createParseContext(content,options)
  return parseContext.parseElement()
}

export {
  ParseOptions,
  parse
}