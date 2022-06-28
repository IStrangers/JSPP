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
  childrenVirtualDOM : VirtualNode[]
}

function createVirtualNode
( 
  tag : string,
  type: NodeType,
  attribute: NodeAttribute[],
  childrenVirtualDOM : VirtualNode[]
) : VirtualNode {
  return {
    tag,
    type,
    attribute,
    childrenVirtualDOM
  }
}

export {
  NodeAttribute,
  NodeType,
  VirtualNode,
  createVirtualNode
}