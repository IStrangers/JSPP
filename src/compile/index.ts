import { VirtualNode } from "../dom";
import { AstNode, AstNodeType, CommentAstNode, ElementAstNode, ElementDirective, InterpolationAstNode, TextAstNode } from "../parser/ast";

function complie(ctx : any,astNode : AstNode | null) : VirtualNode | null {
    if(astNode == null) {
        return null
    }
    const code = `{
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
    const propComplieResult = complieElementProp(astNode)
    const childrenComplieResult = complieElementChildrenAstNode(astNode)
    return `cvh("${astNode.tag}",NodeType.ELEMENT,${propComplieResult},${childrenComplieResult})`
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
            
        } else if(name.startsWith("#")) {
            const [isAttr,result] = handlingCommand(directive)
            if(isAttr) {
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

function handlingCommand({name,value} : ElementDirective) : [boolean,string] {
    const command = name.substring(1)
    let isAttr = false
    let result = ""
    switch(command) {
        case "for":
            break
        case "if":
            break
        case "show":
            break
        case "html":
            isAttr = true
            result = `{innerHTML:${value}}`
            break
        case "text":
            isAttr = true
            result = `{innerText:${value}}`
            break
    }
    return [isAttr,result]
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