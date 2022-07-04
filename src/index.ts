import { parse } from "./parser"
import { complie } from "./compile"
import { NodeType,cvh,renderVirtualNode,renderForCommand,renderShowCommand } from "./dom"
import { reactive } from "./reactivity/reactive"
import { Component } from "./component"

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
            const virtualNode = complie(ctx,astNode)
            container.innerHTML = ""
            renderVirtualNode(container,virtualNode)
        }
    }
}

export const Jspp = (window["Jspp"] = {
    createApp,
    parse,
    complie,
    cvh,
    renderVirtualNode,
    renderForCommand,
    renderShowCommand,
    NodeType,
    reactive,
})

