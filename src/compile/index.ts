import { NodeType, VirtualNode } from "../dom";
import { AstNode, AstNodeType, CommentAstNode, ElementAstNode, ElementDirective, InterpolationAstNode, TextAstNode } from "../parser/ast";
import { isNumber } from "../util";

function complie(ctx : any,astNode : AstNode | null) : VirtualNode | null {
    if(astNode == null) {
        return null
    }
    const code = `
        const {
            cvh,
            renderVirtualNode,
            renderForCommand,
            renderShowCommand,
            NodeType,
        } = Jspp
        with(ctx) {
            return ${complieAstNode(astNode)}
        }
    `
    const virtualNode = new Function("ctx",code)(ctx)
    return virtualNode
}

function complieAstNode(astNode : AstNode) : string {
    let complieResult = ""
    const nodeType = astNode.nodeType
    switch(nodeType) {
        case AstNodeType.ROOT_NODE:
            complieResult = complieRootNode(astNode as ElementAstNode)
            break
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

function complieRootNode(astNode : ElementAstNode) : string {
    return `cvh(null,NodeType.ROOT_NODE,null,null,${complieElementChildrenAstNode(astNode)})`
}

function complieElementAstNode(astNode : ElementAstNode) : string {
    const directiveMap = getDirectiveMap(astNode.directives)
    const forCommand = directiveMap["#for"]
    const ifCommand = directiveMap["#if"] || directiveMap["#else-if"]
    const showCommand = directiveMap["#show"]

    if(forCommand !== undefined) {
        const [command,index] = forCommand
        astNode.directives.splice(index,1)
        const [args,source] = command.split(/\sin\s/)
        return `cvh(null,NodeType.FRAGMENT,null,null,renderForCommand(${source},${args} => ${complieElementAstNode(astNode)}))`
    }

    if(ifCommand !== undefined) {
        const [command,index] = ifCommand
        astNode.directives.splice(index,1)
        const condition = command
        const consequent = complieElementAstNode(astNode)
        let alternate;
        
        const {childrenNode} = astNode.parent;
        const currentNodeIndex = childrenNode.findIndex(child => child === astNode)
        let nextSiblingNodeIndex = currentNodeIndex + 1
        for (; nextSiblingNodeIndex < childrenNode.length; nextSiblingNodeIndex++) {
            const nextSiblingNode = childrenNode[nextSiblingNodeIndex]
            if(nextSiblingNode.nodeType === AstNodeType.ELEMENT){
                break
            }
        }
        let nextElementSiblingNode = childrenNode[nextSiblingNodeIndex]
        if(
            nextElementSiblingNode &&
            nextElementSiblingNode.nodeType === AstNodeType.ELEMENT && 
            (
                getDirectiveMap(astNode.directives)["#else-if"] !== undefined || 
                getDirectiveMap(astNode.directives)["#else"] !== undefined
            )
        ) {
            alternate = complieElementAstNode(nextElementSiblingNode as ElementAstNode)
            childrenNode.splice(currentNodeIndex + 1,nextSiblingNodeIndex - currentNodeIndex)
        }

        return `${condition} ? ${consequent} : ${alternate ? alternate : complieCommentAstNode({parent:astNode,nodeType:AstNodeType.COMMENT,content:""})}`
    }

    if(showCommand !== undefined) {
        const [command,index] = showCommand
        astNode.directives.splice(index,1)
        const condition = command
        return `renderShowCommand(${condition},() => ${complieElementAstNode(astNode)})`
    }

    const propComplieResult = complieElementProp(astNode)
    const childrenComplieResult = complieElementChildrenAstNode(astNode)
    return `cvh("${astNode.tag}",NodeType.ELEMENT,null,${propComplieResult},${childrenComplieResult})`
}

function getDirectiveMap(directives : Array<ElementDirective>) : object {
    const directiveMap = {}
    directives.map((directive,index) => {
        const {name,value} = directive
        directiveMap[name] = [value,index]
    })
    return directiveMap
}

function complieElementProp(astNode : ElementAstNode) : string {
    const {attributes,directives} = astNode;
    const attrs : Array<string> = []
    const events : Array<string> = []
    attributes.forEach(attribute => {
        const {name,value} = attribute
        let attrValue = `"${value}"`
        if(name === "style") {
            attrValue = parseStyleValue(value)
        }
        attrs.push(`{attrName:"${name}",attrValue:${attrValue}}`)
    })
    directives.forEach(directive => {
        const {name,value} = directive
        if(name.startsWith("@")) {
            events.push(handlingEvent(directive))
        } else if(name.startsWith(":")) {
            const attrName = name.substring(1)
            let attrValue = value
            if(attrName === "style") {
                attrValue = parseStyleValue(value)
            }
            attrs.push(`{attrName:"${attrName}",attrValue:${attrValue}}`)
        } else if(name.startsWith("#")) {
            const result = handlingCommand(directive)
            if(result) {
                attrs.push(result)
            }
        }
    })
    return `{attributes:[${attrs}],events:[${events}]}`
}

function parseStyleValue(styleValue : string) : string {
    if(!styleValue) {
        return "{}"
    }
    if(styleValue.startsWith("{") && styleValue.endsWith("}") ) {
        return styleValue
    }
    const parseResult : Array<string> = []
    const items = styleValue.split(";")
    for(let i = 0; i < items.length; i++) {
        const item = items[i]
        const [key,value] = item.split(":")
        parseResult.push(`${key}:${isNumber(value) ? value : `"${value}"`}`)
    }
    return `{${parseResult.join(",")}}`
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
        case "mode":
            break
        case "html":
            result = `{attrName:"innerHTML",attrValue:${value}}`
            break
        case "text":
            result = `{attrName:"innerText",attrValue:${value}}`
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