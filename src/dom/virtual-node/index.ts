interface NodeAttribute {
  attrName : string
  attrValue : any
}

interface NodeEvent {
  eventName : string
  eventHandling : EventListenerOrEventListenerObject
}

interface NodeProp {
  attributes: Array<NodeAttribute>
  events : Array<NodeEvent>
}

enum NodeType {
  ELEMENT,
  TEXT,
  NUMBER,
  COMMENT,
  FRAGMENT,
}

interface VirtualNode {
  tag : string | null
  type : NodeType
  data : string | null
  prop : NodeProp | null
  childrenVirtualNode : Array<VirtualNode> | null
}

function createVirtualNode
(
  tag : string | null,
  type : NodeType,
  data : string | null,
  prop : NodeProp | null,
  childrenVirtualNode : Array<VirtualNode> | null
) : VirtualNode {
  return {
    tag,
    type,
    data,
    prop,
    childrenVirtualNode
  }
}

export {
  NodeAttribute,
  NodeEvent,
  NodeProp,
  NodeType,
  VirtualNode,
  createVirtualNode as cvh
}