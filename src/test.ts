import { complie } from "./compile"
import {Jspp} from "./index"
import { parse } from "./parser"
import { effect } from "./reactivity/effect"
import { reactive } from "./reactivity/reactive"

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
const obj = reactive({
    userName: "Jspp",
    age: 0
})

const renner = effect(function(){
    document.write(`用户名：${obj.userName},年龄：${obj.age}`)
    obj.age = Math.random()
},{
    scheduler: function(){
        renner()
    }
})

setTimeout(function(){
    obj.age = 100
},1000)