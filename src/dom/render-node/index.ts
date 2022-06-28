import { isObject, isString, isFunction } from "../../util"
import {NodeType,NodeAttribute,VirtualNode} from "../virtual-node"

function createNode(virtualNode : VirtualNode) : Node | undefined {
  switch(virtualNode.type) {
    case NodeType.ELEMENT:
      if(virtualNode.tag) {
        const node = document.createElement(virtualNode.tag)
        if(virtualNode.attribute){
          mountNodeAttribute(node,virtualNode.attribute)
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
        return document.createTextNode(virtualNode.data)
      }
  }
}

function mountNodeAttribute(mountNode : HTMLElement,attribute : NodeAttribute[]) {
  for(let i = 0; i < attribute.length; i++) {
    const attr = attribute[i]
    const attrName = attr.name
    const attrValue = attr.value
    switch(attrName) {
      case "style":
        if(isObject(attrValue)) {
          const styleNames = Object.keys(attrValue)
          for(let j = 0; j < styleNames.length; j++) {
            const styleName = styleNames[j]
            mountNode.style[styleName] = attrValue[styleName]
          }
        }
        break
      case "@click":
        if(isFunction(attrValue)) {
          const eventName = attrName.substring(1)
          mountNode.addEventListener(eventName,attrValue)
        }
        break
      default:
        if(attrName in mountNode) {
          mountNode[attrName] = attrValue
        } else {
          mountNode.setAttribute(attrName,attrValue)
        }
        break
    }
  }
}

function renderVirtualNode(mountNode : Node | null,virtualNode : VirtualNode) {
  if(mountNode === null) {
    return
  }
  const node = createNode(virtualNode)
  if(node === undefined) {
    return
  }
  mountNode.appendChild(node)
  const childrenVirtualNode = virtualNode.childrenVirtualNode
  if(childrenVirtualNode && childrenVirtualNode.length > 0) {
    for(let i = 0; i < childrenVirtualNode.length; i++) {
      virtualNode = childrenVirtualNode[i]
      renderVirtualNode(node,virtualNode)
    }
  }
}

export {
  renderVirtualNode
}