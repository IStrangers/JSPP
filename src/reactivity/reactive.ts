import {isObject} from "../util"
import { track, trigger } from "./effect"

enum ReactiveAttribute {
    IS_REACTIVE = "__isReactive__"
}

const reactiveMap = new WeakMap()

function reactive<T extends object>(obj : T) : T {
    if(isReactive(obj)) {
        return obj
    }
    let reactiveObj = reactiveMap.get(obj)
    if(reactiveObj) {
        return reactiveObj
    }
    reactiveObj = new Proxy(obj,{
        get: (target,property,receiver) => {
            if(property === ReactiveAttribute.IS_REACTIVE){
                return true
            }
            track(target,property,"get")
            const val = Reflect.get(target,property,receiver)
            return isObject(val) ? reactive(val) : val
        },
        set: (target,property,value,receiver) => {
            if(target[property] === value) {
                return false
            }
            const val = Reflect.set(target,property,value,receiver)
            trigger(target,property,oldValue,newValue,"set")
            return val
        }
    })
    reactiveMap.set(obj,reactiveObj)
    return reactiveObj
}

function isReactive<T extends object>(obj : T) : boolean {
    return obj && obj[ReactiveAttribute.IS_REACTIVE]
}

export {
    reactive,
    isReactive,
}