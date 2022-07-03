import {JSPP} from "./index"

JSPP.createApp({
    setUp() {
        const contacts = ["用户1","用户2","用户3"]
        const getClass = (name : any) => {
            return name
        }
        const contactClick = () => {
            alert("contactClick")
        }
        const mouseenter = () => {
            alert("mouseenter")
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