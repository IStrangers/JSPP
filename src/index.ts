import { complie } from "./compile"
import { NodeType,cvh,renderVirtualNode } from "./dom"
import { parse } from "./parser"

function createApp(component : Component) {
    return {
        monut: function(selector : string) {
            const container = document.querySelector(selector)
            if(!container) {
                return
            }
            const template = container.innerHTML;
            const astNode = parse(template)
            const ctx = component.setUp()
            ctx.cvh = cvh
            ctx.NodeType = NodeType
            const virtualNode = complie(ctx,astNode)
            container.innerHTML = ""
            renderVirtualNode(container,virtualNode)
        }
    }
}

createApp({
    setUp() {
        const contactClick = () => {
            alert("contactClick")
        }
        return {
            userName: "Test JSPP",
            contactClick
        }
    }
}).monut("#app")