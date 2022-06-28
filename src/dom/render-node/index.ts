import {VirtualNode} from "../virtual-node"

function createHTMLElement(virtualNode : VirtualNode) : HTMLElement {
  const element = document.createElement(virtualNode.tag)
  return element
}

function renderVirtualNode(virtualNode : VirtualNode) {
  
}

export {
  renderVirtualNode
}