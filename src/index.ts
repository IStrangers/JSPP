import { reactive } from "./reactive"
import { updateHook } from "./hooks"
import { createVirtualNode, renderVirtualNode } from "./dom/index"
import { NodeType } from "./dom/virtual-node"

updateHook(() => {
    const node = createVirtualNode("ul", NodeType.ELEMENT, "", [], [
        createVirtualNode("li", NodeType.ELEMENT, "", [], [
            createVirtualNode("", NodeType.TEXT, "123", [], []),
        ]),
        createVirtualNode("li", NodeType.ELEMENT, "", [], [
            createVirtualNode("", NodeType.NUMBER, "456", [], []),
        ])
    ])
    renderVirtualNode(document.getElementById("app"), node)
})
const obj = reactive({
    a: 1,
    b: {
        a: 123
    }
})
console.log(obj)

