import {reactive} from './reactive/reactive';

const obj = reactive({a:1})
obj.a = 666
console.log(obj)
