import { ChatProcessor } from "./chatProcessor/chatProcessor.js";


function main() {
    // query knowledge base
    // ChatProcessor.queryKnowledgeBase("tell me more about the project which abhishek has worked on").then((response) => {
    //     console.log(response)
    // })
    // query using tools/functions
    ChatProcessor.queryUsingTools("what all apis does visa have ?").then((response) => {
        console.log(response)
    })


}


main()