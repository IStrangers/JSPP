import {NodeType,VirtualNode} from "../virtual-node"

function createElement(virtualNode : VirtualNode) : Node {
  switch(virtualNode.type) {
    case NodeType.ELEMENT:
      return document.createElement(virtualNode.tag)
    case NodeType.TEXT:
    case NodeType.NUMBER:
      return document.createTextNode(virtualNode.data)
    case NodeType.COMMENT:
      return document.createComment(virtualNode.data)
  }
}

function renderVirtualNode(mountElement : Node | null,virtualNode : VirtualNode) {
  if(mountElement == null) {
    return
  }
  const element = createElement(virtualNode)
  mountElement.appendChild(element)
  const childrenVirtualNode = virtualNode.childrenVirtualNode
  if(childrenVirtualNode.length > 0) {
    for(let i = 0; i < childrenVirtualNode.length; i++) {
      virtualNode = childrenVirtualNode[i]
      renderVirtualNode(element,virtualNode)
    }
  }
}

export {
  renderVirtualNode
}