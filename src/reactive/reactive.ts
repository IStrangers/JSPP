function reactive<T extends object>(obj : T) : T {
    return new Proxy(obj,{
        get: (target,property,receiver) => {
            return Reflect.get(target,property,receiver)
        },
        set: (target,property,value,receiver) => {
            return Reflect.set(target,property,value,receiver)
        }
    });
}

export {
    reactive
}