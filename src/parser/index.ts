import { Ast } from "./ast"
import { removeExtraSpaces } from "../util"

interface ParseOptions {
  delimiters: Array<string>
}

interface ParseContext {
  content : string,
  options : ParseOptions,
  getParseResults : Function
}

function createDefaultParseOptions() : ParseOptions {
  return {
    delimiters: ["{{","}}"]
  }
}

function createParseContext(content : string,options : ParseOptions) : ParseContext {
  let currentIndex = 0
  const nodes : Array<Ast> = []
  return {
    content,
    options,
    getParseResults: () : Array<Ast> => {
      while(currentIndex < content.length) {
        
      }
      return nodes
    }
  }
}

function parse(content : string,options? : ParseOptions) : Array<Ast> {
  if(!content) {
    return []
  }
  if(!options) {
    options = createDefaultParseOptions()
  }
  const parseContext : ParseContext = createParseContext(removeExtraSpaces(content),options)
  return parseContext.getParseResults()
}

export {
  ParseOptions,
  parse
}