import { reactive } from "./reactive"
import { updateHook } from "./hooks"
import { createVirtualNode, renderVirtualNode, NodeType } from "./dom/index"

updateHook(() => {
    const node = createVirtualNode("div", NodeType.ELEMENT, null, null, [
        createVirtualNode("ul", NodeType.ELEMENT, null, null, [
            createVirtualNode("li", NodeType.ELEMENT, null, [{name:"customAttr",value:"custom"},{name:"className",value:"JSPP li"},{name:"style",value:{background:"red"}},{name:"@click",value:()=> alert("click")}], [
                createVirtualNode(null, NodeType.TEXT, "123", null, null),
            ]),
            createVirtualNode("li", NodeType.ELEMENT, null, [{name:"customAttr",value:"custom"},{name:"className",value:"JSPP li"},{name:"style",value:{background:"red"}},{name:"@click",value:()=> alert("click")}], [
                createVirtualNode(null, NodeType.NUMBER, "456", null, null),
            ])
        ]),
        createVirtualNode(null,NodeType.NUMBER, "000", null, null)
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

