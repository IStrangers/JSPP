import { VirtualNode } from "../dom";
import { AstNode, AstNodeType, CommentAstNode, ElementAstNode, ElementDirective, InterpolationAstNode, TextAstNode } from "../parser/ast";

function complie(ctx : any,astNode : AstNode | null) : VirtualNode | null {
    if(astNode == null) {
        return null
    }
    const code = `{
        const {
            cvh,
            renderVirtualNode,
            renderForCommand,
            NodeType,
        } = JSPP
        with(ctx) {
            return ${complieAstNode(astNode)}
        }
    }`
    const virtualNode = new Function("ctx",code)(ctx)
    return virtualNode
}

function complieAstNode(astNode : AstNode) : string {
    let complieResult = ""
    const nodeType = astNode.nodeType
    switch(nodeType) {
        case AstNodeType.ELEMENT:
            complieResult = complieElementAstNode(astNode as ElementAstNode)
            break
        case AstNodeType.TEXT:
            complieResult = complieTextAstNode(astNode as TextAstNode)
            break
        case AstNodeType.INTERPOLATION:
            complieResult = complieInterpolationAstNode(astNode as InterpolationAstNode)
            break
        case AstNodeType.COMMENT:
            complieResult = complieCommentAstNode(astNode as CommentAstNode)
            break
    }
    return complieResult
}

function complieElementAstNode(astNode : ElementAstNode) : string {
    const directives = astNode.directives.filter(directive => directive.name.startsWith("#"))
    const directiveMap = {}
    directives.forEach(directive => {
        const {name,value} = directive
        directiveMap[name] = value
    })
    const forCommand = directiveMap["#for"]
    const ifCommand = directiveMap["#if"]
    const showCommand = directiveMap["#show"]

    const propComplieResult = complieElementProp(astNode)
    const childrenComplieResult = complieElementChildrenAstNode(astNode)

    if(forCommand !== undefined) {
        const [args,source] = forCommand.split(/\sin\s/)
        return `renderForCommand(${source},${args} => cvh("${astNode.tag}",NodeType.ELEMENT,null,${propComplieResult},${childrenComplieResult}))`
    }
    return `cvh("${astNode.tag}",NodeType.ELEMENT,null,${propComplieResult},${childrenComplieResult})`
}

function complieElementProp(astNode : ElementAstNode) : string {
    const {attributes,directives} = astNode;
    const attrs : Array<string> = []
    const events : Array<string> = []
    attributes.forEach(attribute => attrs.push(`{attrName:"${attribute.name}",attrValue:"${attribute.value}"}`))
    directives.forEach(directive => {
        const {name} = directive
        if(name.startsWith("@")) {
            events.push(handlingEvent(directive))
        } else if(name.startsWith(":")) {
            attrs.push(`{attrName:"${name.substring(1)}",attrValue:${directive.value}}`)
        } else if(name.startsWith("#")) {
            const result = handlingCommand(directive)
            if(result) {
                attrs.push(result)
            }
        }
    })
    return `{attributes:[${attrs}],events:[${events}]}`
}

function handlingEvent({name,value} : ElementDirective) : string {
    const eventName = name.substring(1)
    let eventHandling = value
    if(eventHandling.includes("=>") === false && (eventHandling.includes("(") && eventHandling.includes(")"))) {
        eventHandling = `$event => (${eventHandling})`
    }
    return `{eventName:"${eventName}",eventHandling:${eventHandling}}`
}

function handlingCommand({name,value} : ElementDirective) : string {
    const command = name.substring(1)
    let result = ""
    switch(command) {
        case "html":
            result = `{innerHTML:${value}}`
            break
        case "text":
            result = `{innerText:${value}}`
            break
    }
    return result
}

function complieElementChildrenAstNode(astNode : ElementAstNode) : string {
    const childrenNode = astNode.childrenNode
    if((childrenNode && childrenNode.length > 0) == false) {
        return ""
    }
    const childrenComplieResult : Array<string> = []
    childrenNode.forEach(node => childrenComplieResult.push(complieAstNode(node)))
    return `[${childrenComplieResult.join(",")}]`
}

function complieTextAstNode(astNode : TextAstNode) : string {
    return `cvh(null,NodeType.TEXT,"${astNode.content}",null,null)`
}

function complieInterpolationAstNode(astNode : InterpolationAstNode) : string {
    return `cvh(null,NodeType.TEXT,${astNode.expression},null,null)`
}

function complieCommentAstNode(astNode : CommentAstNode) : string {
    return `cvh(null,NodeType.COMMENT,"${astNode.content}",null,null)`
}

export {
    complie
}