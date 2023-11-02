import { ChatProcessor } from "./chatProcessor/chatProcessor.js";


function main() {
    // query knowledge base
    ChatProcessor.queryKnowledgeBase("describe how to deploy an API to prod").then((response) => {
        console.log(response)
    })


}


main()