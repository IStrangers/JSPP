import {NodeType,VirtualNode} from "../virtual-node"

function createElement(virtualNode : VirtualNode) : Node | undefined{
  switch(virtualNode.type) {
    case NodeType.ELEMENT:
      if(virtualNode.tag) {
        return document.createElement(virtualNode.tag)
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

function renderVirtualNode(mountElement : Node | null,virtualNode : VirtualNode) {
  if(mountElement === null) {
    return
  }
  const element = createElement(virtualNode)
  if(element === undefined) {
    return
  }
  mountElement.appendChild(element)
  const childrenVirtualNode = virtualNode.childrenVirtualNode
  if(childrenVirtualNode && childrenVirtualNode.length > 0) {
    for(let i = 0; i < childrenVirtualNode.length; i++) {
      virtualNode = childrenVirtualNode[i]
      renderVirtualNode(element,virtualNode)
    }
  }
}

export {
  renderVirtualNode
}