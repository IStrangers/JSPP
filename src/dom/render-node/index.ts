import {NodeType,VirtualNode} from "../virtual-node"

function createHTMLElement(virtualNode : VirtualNode) : HTMLElement | Text | Comment | undefined{
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

function renderVirtualNode(virtualNode : VirtualNode) {
  
}

export {
  renderVirtualNode
}