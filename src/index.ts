import { parse } from "./parser"
import { complie } from "./compile"
import { NodeType,cvh,renderVirtualNode,renderForCommand,renderShowCommand } from "./dom"
import { reactive } from "./reactive"
import { updateHook } from "./hooks"
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

export const JSPP = (window["JSPP"] = {
    createApp,
    parse,
    complie,
    cvh,
    renderVirtualNode,
    renderForCommand,
    renderShowCommand,
    NodeType,
    reactive,
    updateHook,
})

