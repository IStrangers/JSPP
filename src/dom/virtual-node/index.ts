interface NodeAttribute {
  name: any
  value : any
}

enum NodeType {
  ELEMENT,
  TEXT,
  NUMBER,
  COMMENT
}

interface VirtualNode {
  tag : string | null
  type : NodeType
  data : string | null
  attribute : Array<NodeAttribute> | null
  childrenVirtualNode : Array<VirtualNode> | null
}

function createVirtualNode
(
  tag : string | null,
  type : NodeType,
  data : string | null,
  attribute : Array<NodeAttribute> | null,
  childrenVirtualNode : Array<VirtualNode> | null
) : VirtualNode {
  return {
    tag,
    type,
    data,
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