import {isObject} from "../util"
import {hooksContext} from "../hooks"

function reactive<T extends object>(obj : T) : T {
    return new Proxy(obj,{
        get: (target,property,receiver) => {
            if(property === "__isReactive__"){
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
            hooksContext.updateHooks.forEach(hook => hook())
            return val
        }
    });
}

export {
    reactive
}