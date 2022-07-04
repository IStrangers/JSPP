import {isObject} from "../util"

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
            const val = Reflect.get(target,property,receiver)
            return isObject(val) ? reactive(val) : val
        },
        set: (target,property,value,receiver) => {
            if(Reflect.get(target,property,receiver) === value) {
                return false
            }
            const val = Reflect.set(target,property,value,receiver)
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