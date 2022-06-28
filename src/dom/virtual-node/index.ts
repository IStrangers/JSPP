interface NodeAttribute {
  name : string
  value : string
}

enum NodeType {
  ELEMENT,
  TEXT,
  NUMBER,
  COMMENT
}

interface VirtualNode {
  tag : string
  type: NodeType
  attribute: NodeAttribute[]
  childrenVirtualNode
 : VirtualNode[]
}

function createVirtualNode
( 
  tag : string,
  type: NodeType,
  attribute: NodeAttribute[],
  childrenVirtualNode
 : VirtualNode[]
) : VirtualNode {
  return {
    tag,
    type,
    attribute,
    childrenVirtualNode
  }
}

export {
  NodeAttribute,
  NodeType,
  VirtualNode,
  createVirtualNode
}