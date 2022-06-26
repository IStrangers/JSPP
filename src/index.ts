import {reactive} from "./reactive"
import {updateHook} from "./hooks"

updateHook(() => {
    console.log(666)
})
const obj = reactive({a:1})
obj.a = 666
console.log(obj)
