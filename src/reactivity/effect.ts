
let activeEffect : ReactiveEffect | null;

class ReactiveEffect {

  public parent : ReactiveEffect | null  = null
  public deps : Array<Set<ReactiveEffect>> = []
  public active = true
  constructor(public fn : Function) {

  }

  run() {
    if(!this.active) { return this.fn() }
    try {
      this.parent = activeEffect
      activeEffect = this
      return this.fn()
    } finally {
      activeEffect = this.parent
    }
  }

}

function effect(fn : Function) {
  const reactiveEffect = new ReactiveEffect(fn)
  reactiveEffect.run()
}


const targetMap = new WeakMap()

function track<T extends object>(target : T,key : string | symbol,type : string) {
  if(!activeEffect) {
    return
  }
  let depsMap = targetMap.get(target)
  if(!depsMap) {
    targetMap.set(target,depsMap = new Map())
  }
  let deps = depsMap.get(key)
  if(!deps) {
    depsMap.set(key,deps = new Set())
  }
  if(deps.has(activeEffect)) {
    return
  }
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

function trigger<T extends object>(target : T,key : string | symbol,oldValue : any,newValue : any,type : string) {
  let depsMap = targetMap.get(target)
  if(!depsMap) {
    return
  }
  let deps : Set<ReactiveEffect> = depsMap.get(key)
  if(!deps) {
    return
  }
  deps && deps.forEach(reactiveEffect => {
    if(activeEffect !== reactiveEffect) {
      reactiveEffect.run()
    }
  });
}

export {
  effect,
  track,
  trigger
}