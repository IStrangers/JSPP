import {reactive} from "./reactive"
import {updateHook} from "./hooks"

updateHook(() => {
    console.log(666)
})
const obj = reactive({
    a:1,
    b:{
        a:123
    }
})
obj.a = 5
console.log(obj.b)
console.log(obj.b.a)
