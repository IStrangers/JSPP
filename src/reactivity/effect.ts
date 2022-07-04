
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
    } catch (error) {
      activeEffect = this.parent
      this.parent = null
      this.active = false
    }
  }

}

function effect(fn : Function) {
  const reactiveEffect = new ReactiveEffect(fn)
  reactiveEffect.run()
}


const targetMap = new WeakMap()

function track<T extends object>(target : T,key : string,type : string) {
  if(!activeEffect) {
    return
  }
  let depsMap = targetMap.get(target)
  if(!depsMap) {
    targetMap.set(target,depsMap = (new WeakMap()))
  }
  let dep = depsMap.get(key)
  if(!dep) {
    depsMap.set(key,(dep = new Set()))
  }
  if(dep.has(activeEffect)) {
    return
  }
  dep.push(activeEffect)
  activeEffect.deps.push(dep)
}

function trigger() {

}

export {
  effect,
  track,
  trigger
}