import {Jspp} from "./index"

Jspp.createApp({
    setUp() {
        const contacts = ["用户1","用户2","用户3"]
        const getClass = (name : any) => {
            return name
        }
        const contactClick = () => {
            console.log("contactClick")
        }
        const mouseenter = () => {
            console.log("mouseenter")
        }
        return {
            userName: "用户名称",
            contacts,
            contactClick,
            getClass,
            mouseenter,
        }
    }
}).monut("#app")