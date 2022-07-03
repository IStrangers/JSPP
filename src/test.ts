import {JSPP} from "./index"

JSPP.createApp({
    setUp() {
        const contactClick = () => {
            alert("contactClick")
        }
        return {
            userName: "Test JSPP",
            contactClick
        }
    }
}).monut("#app")