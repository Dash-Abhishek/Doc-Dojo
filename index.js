import { ChatProcessor } from "./chatProcessor/chatProcessor.js";
import express from  "express"
import config from "config"
import bodyParser  from "body-parser"
import {healthCheck} from "./dojo/vectorStore.js"
import {PrepareKnowledgeBase} from "./dojo/index.js"

// check For LLM API key
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
    console.log("OPENAI_API_KEY is not set")
    process.exit(1)
}


const app = express()
const port = process.env.PORT || config.get("charServer.port")
app.use(bodyParser.json())

app.post('/conversation', (req, res) => {
    console.log("userMessage: ", req.body.userMessage)
    ChatProcessor.queryKnowledgeBase(req.body.userMessage).then((response) => {
        console.log("BotMessage: ", response)
        res.send({
            chatResponse: response
        })
    })
})

app.get('/health', (req, res) => {
    res.status(200)
})


const bootUp = async()=>{

    let status = await checkDBHealth()

    if (status){
        // populate the knowledge base
        console.log("preparing knowledge base.....")
        await PrepareKnowledgeBase("dir", config.get("trainingDataPath"))

        app.listen(port, () => {
            console.log(`Chat server running on port ${port}`)
        })
    }
}


const checkDBHealth = async ()=>{
    // let data = await healthCheck(10)
    for (let i=0; i<10; i++){
        let data = await healthCheck()
        if (data){
            console.log("vector store is ready")
            return true
        }else{
            console.log("vector store is not ready, retrying in 5 seconds", )
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    
    }
  
}



bootUp()