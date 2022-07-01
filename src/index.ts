import { reactive } from "./reactive"
import { updateHook } from "./hooks"
import { createVirtualNode, renderVirtualNode, NodeType } from "./dom"
import { parse } from "./parser"

updateHook(() => {
    const template = document.getElementById("app")?.innerHTML
    const astNodes = parse(template ? template : "")
    console.log(astNodes)
    //renderVirtualNode(document.getElementById("app"),node)
})
const obj = reactive({
    a: 1,
    b: {
        a: 123
    }
})
console.log(obj)

