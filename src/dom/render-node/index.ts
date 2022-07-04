import { isArray, isNumber, isObject, isString } from "../../util"
import {NodeType,NodeProp,VirtualNode} from "../virtual-node"

function createNode(virtualNode : VirtualNode) : Node | undefined {
  switch(virtualNode.type) {
    case NodeType.ELEMENT:
      if(virtualNode.tag) {
        const node = document.createElement(virtualNode.tag)
        if(virtualNode.prop){
          mountNodeAttribute(node,virtualNode.prop)
        }
        return node
      }
    case NodeType.TEXT:
    case NodeType.NUMBER:
      if(virtualNode.data) {
        return document.createTextNode(virtualNode.data)
      }
    case NodeType.COMMENT:
      if(virtualNode.data) {
        return document.createComment(virtualNode.data)
      }
  }
}

function mountNodeAttribute(mountNode : HTMLElement,prop : NodeProp) {
  
  const {attributes,events} = prop
  for(let i = 0; i < attributes.length; i++) {
    const {attrName,attrValue} = attributes[i]
    if("style" === attrName) {
      if(isObject(attrValue)) {
        const styleNames = Object.keys(attrValue)
        for(let j = 0; j < styleNames.length; j++) {
          const styleName = styleNames[j]
          mountNode.style[styleName] = attrValue[styleName]
        }
      }
    } else {
      if(attrName in mountNode) {
        mountNode[attrName] = attrValue
      } else {
        mountNode.setAttribute(attrName,attrValue)
      }
    }
  }

  for(let i = 0; i < events.length; i++) {
    const {eventName,eventHandling} = events[i]
    mountNode.addEventListener(eventName,eventHandling)
  }

}

function renderVirtualNode(mountNode : Node | null,virtualNode : VirtualNode | null) {
  if(mountNode === null || virtualNode === null) {
    return
  }
  let node
  if(virtualNode.type === NodeType.ROOT_NODE || virtualNode.type === NodeType.FRAGMENT){
    node = mountNode
  } else {
    node = createNode(virtualNode)
    if(node === undefined) {
      return
    }
    mountNode.appendChild(node)
  }
  const childrenVirtualNode = virtualNode.childrenVirtualNode
  if(childrenVirtualNode && childrenVirtualNode.length > 0) {
    for(let i = 0; i < childrenVirtualNode.length; i++) {
      virtualNode = childrenVirtualNode[i]
      renderVirtualNode(node,virtualNode)
    }
  }
}

function renderForCommand(source : number | string | object | Array<any>,renderHandling : Function) : Array<VirtualNode> {
  const virtualNodes : Array<VirtualNode> = []
  if(isArray(source) || isString(source)) {
    const data = source as any
    for(let i = 0; i < data.length; i++) {
      virtualNodes.push(renderHandling(data[i],i))
    }
  } else if(isObject(source)) {
    const data = source as object
    const dataKeys = Object.keys(data)
    for(let i = 0; i < dataKeys.length; i++) {
      const key = dataKeys[i]
      virtualNodes.push(renderHandling(data[key],key))
    }
  } else if(isNumber(source)) {
    const data = source as number
    for(let i = 0; i < data; i++) {
      virtualNodes.push(renderHandling(i))
    }
  }
  return virtualNodes
}

function renderShowCommand(condition : boolean,renderHandling : Function) {
  const virtualNode : VirtualNode = renderHandling()
  if(condition == false && virtualNode.prop) {
    const styleIndex = virtualNode.prop.attributes.findIndex(attribute => attribute.attrName === "style")
    if(styleIndex !== -1) {
      virtualNode.prop.attributes[styleIndex].attrValue["display"] = "none"
    } else {
      virtualNode.prop.attributes.push({attrName:"style",attrValue:{display:"none"}})
    }
  }
  return virtualNode
}

export {
  renderVirtualNode,
  renderForCommand,
  renderShowCommand,
}