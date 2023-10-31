import { Chroma } from "langchain/vectorstores/chroma";
import { ProcessDoc } from './document.js';
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { ChromaClient } from "chromadb";
import config from "config"
import { getStoreConfig } from '../store.js'


const PrepareKnowledgeBase = async (docType, path) => {

    try {
        let processedData = await ProcessDoc(docType, path)
        // load process data to vector store
        let embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY })
        let vectorStore = await Chroma.fromDocuments(processedData, embeddings, getStoreConfig());
        console.log("successfully stored vector data", vectorStore.embeddings)
        PeekTrainingData(vectorStore)
    } catch (err) {
        console.log("failed to store vector data", err)
        return err
    }

}


const PeekTrainingData = async () => {

    const client = new ChromaClient({
        path: config.get("vectorStore.host"),
    });
    try {
        const collection = await client.getCollection({ name: config.get("vectorStore.primaryCollection") });
        console.log((await collection.peek({ limit: 10 })))

    } catch (err) {

        console.log("failed to peek training data", err)
    }
}



const DeleteVectorData = async () => {

    const client = new ChromaClient({
        path: config.get("vectorStore.host"),
    });
    try {
        await client.deleteCollection({ name: config.get("vectorStore.primaryCollection") });
        console.log("successfully deleted vector data", config.get("vectorStore.primaryCollection"))

    } catch (err) {
        console.log("failed to delete vector collection:", err)
    }
}


PrepareKnowledgeBase("dir", "./data/Stargate-doc")

// DeleteVectorData()

// PeekTrainingData()