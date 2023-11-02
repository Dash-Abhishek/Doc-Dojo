import { Chroma } from "langchain/vectorstores/chroma";
import { ProcessDoc } from './document.js';
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { ChromaClient } from "chromadb";
import config from "config"
import { getStoreConfig } from '../store.js'

/**
 * Process documents and store in vector store
 * @param {string} docType 
 * @param {string} path 
 * @returns 
 */
const PrepareKnowledgeBase = async (docType, path) => {

    try {
        let processedData = await ProcessDoc(docType, path)
        // load process data to vector store
        let embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY })
        let vectorStore = await Chroma.fromDocuments(processedData, embeddings, getStoreConfig());
        console.log("training completed")
        PeekTrainingData(vectorStore)
    } catch (err) {
        if (err.code && err.code === 'ENOENT') {
            console.log("Provided path is not valid:", path)
            return
        }
        console.log("failed to store vector data", err)
        return err
    }

}

/**
 * Peek training data
 */
const PeekTrainingData = async () => {

    const client = new ChromaClient({
        path: config.get("vectorStore.host"),
    });
    try {
        const collection = await client.getCollection({ name: config.get("vectorStore.primaryCollection") });
        let docIds = await collection.peek().then((res) => res.ids.map((id) => id))
        console.log(docIds)

    } catch (err) {

        console.log("failed to peek training data", err)
    }
}


/**
 * Delete knowledge base
 * Deletes the primary collection
 */
const DeleteKnowledgeBase = async () => {

    const client = new ChromaClient({
        path: config.get("vectorStore.host"),
    });
    try {
        await client.deleteCollection({ name: config.get("vectorStore.primaryCollection") });
        console.log("successfully deleted vector data, primary collection:", config.get("vectorStore.primaryCollection"))

    } catch (err) {
        console.log("failed to delete vector collection:", err)
    }
}


/**
 * Main function
 * @returns 
 */
const main = async () => {

    if (!process.env.OPENAI_API_KEY) {
        console.log("OPENAI_API_KEY is not set")
        return
    }

    let args = process.argv.slice(2)
    switch (args[0]) {
        case "learn":
            await PrepareKnowledgeBase("dir", config.get("trainingDataPath"))
            break;
        case "unlearn":
            await DeleteKnowledgeBase()
            break;
        case 'view':
            await PeekTrainingData()
            break;
        default:
            console.log("invalid command")
    }

}
main()