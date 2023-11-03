import { ChatProcessor } from "./chatProcessor/chatProcessor.js";
import express from  "express"
import config from "config"
import bodyParser  from "body-parser"



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

if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
    console.log("OPENAI_API_KEY is not set")
    process.exit(1)
}

app.listen(port, () => {
  console.log(`Chat server listening on ${port}`)
})