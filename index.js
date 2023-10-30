import { ChatProcessor } from "./chatProcessor/chatProcessor.js";


function main() {
    // query knowledge base
    ChatProcessor.queryKnowledgeBase("what all domains are supported in proxy configuration ?").then((response) => {
        console.log(response)
    })


}


main()