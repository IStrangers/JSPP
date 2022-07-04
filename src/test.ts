import { complie } from "./compile"
import {Jspp} from "./index"
import { parse } from "./parser"
import { computed } from "./reactivity/computed"
import { effect } from "./reactivity/effect"
import { reactive } from "./reactivity/reactive"
import { proxyRefs, ref, toRefs } from "./reactivity/ref"
import { watch } from "./reactivity/watch"

// Jspp.createApp({
//     setUp() {
//         const contacts = ["用户1","用户2","用户3"]
//         const getClass = (name : any) => {
//             return name
//         }
//         const contactClick = () => {
//             console.log("contactClick")
//         }
//         const mouseenter = () => {
//             console.log("mouseenter")
//         }
//         return {
//             userName: "用户名称",
//             contacts,
//             contactClick,
//             getClass,
//             mouseenter,
//         }
//     }
// }).monut("#app")

// Jspp.createApp({
//     setUp() {
//         let AstContent = ""
//         let cvhContent = ""
//         let htmlContent = ""

//         const codeInput = function(e : InputEvent) {
//             const template : string = (e.target as HTMLElement).innerText
//             const astNode = parse(template)
//             var cache : any = [];
//             AstContent = JSON.stringify(astNode,function(key,value) {
//                 if (typeof value === 'object' && value !== null) {
//                     if (cache.indexOf(value) !== -1) {
//                         return;
//                     }
//                     cache.push(value);
//                 }
//                 return value;
//             })
//             const cvhCode = complie({},astNode)
//             cvhContent = JSON.stringify(cvhCode)
//         }

//         return {
//             codeInput,
//             AstContent,
//             cvhContent,
//             htmlContent,
//         }
//     }
// }).monut("#app")

// const obj = reactive({
//     userName: "Jspp",
//     age: 0
// })

// const renner = effect(function(){
//     document.write(`用户名：${obj.userName},年龄：${obj.age}`)
//     obj.age = Math.random()
// },{
//     scheduler: function(){
//         renner()
//     }
// })

// const obj = reactive({
//     userName: "Jspp",
//     age: 0
// })

// const context = computed({
//     get:() =>{
//         return `用户名：${obj.userName},年龄：${obj.age}`
//     },
//     set:() => {

//     }
// })

// effect(function(){
//     document.write(context.value)
// })

// setTimeout(function(){
//     obj.age = 100
// },1000)

// const obj = reactive({
//     userName: "Jspp",
//     age: 0
// })

// watch(() => obj.age,(oldValue : any,newValue : any,onClear : Function) => {
//     console.log(oldValue)
//     console.log(newValue)
// })

// obj.age = 100

// const obj = ref(true)

// watch(() => obj.value,(oldValue : any,newValue : any,onClear : Function) => {
//     console.log(oldValue)
//     console.log(newValue)
// })

// obj.value = false


const obj = reactive({
    userName: "Jspp",
    age: 0
})

const {userName,age} = toRefs(obj)
console.log(userName.value)
console.log(age.value)

const proxyRefsObj = proxyRefs({userName,age})
console.log(proxyRefsObj.userName)
console.log(proxyRefsObj.age)