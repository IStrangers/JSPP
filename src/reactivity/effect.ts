
let activeEffect : ReactiveEffect | null;

class ReactiveEffect {

  public parent : ReactiveEffect | null  = null
  public deps : Array<Set<ReactiveEffect>> = []
  public active = true
  constructor(public fn : Function,public scheduler : Function | undefined) {

  }

  run() {
    if(!this.active) { return this.fn() }
    try {
      this.parent = activeEffect
      activeEffect = this
      clearReactiveEffect(this)
      return this.fn()
    } finally {
      activeEffect = this.parent
    }
  }

  stop() {
    if(this.active) {
      this.active = false
      clearReactiveEffect(this)
    }
  }

}

function clearReactiveEffect(reactiveEffect : ReactiveEffect) {
  const {deps} = reactiveEffect
  for(let i = 0; i < deps.length; i++) {
    deps[i].delete(reactiveEffect)
  }
  deps.length = 0
}

interface EffectOptions {
  scheduler? : Function
}

function effect(fn : Function,options : EffectOptions = {}) {
  const { scheduler } = options
  const reactiveEffect = new ReactiveEffect(fn,scheduler)
  reactiveEffect.run()
  const runner = reactiveEffect.run.bind(reactiveEffect)
  runner["reactiveEffect"] = reactiveEffect
  return runner
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
  let copyDeps : Set<ReactiveEffect> = new Set(depsMap.get(key))
  if(!copyDeps) {
    return
  }
  copyDeps && copyDeps.forEach(reactiveEffect => {
    if(activeEffect !== reactiveEffect) {
      reactiveEffect.scheduler ? reactiveEffect.scheduler() : reactiveEffect.run()
    }
  });
}

export {
  effect,
  track,
  trigger
}