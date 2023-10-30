import { Chroma } from "langchain/vectorstores/chroma";
import { ProcessDoc } from './document.js';
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { ChromaClient } from "chromadb";



import { getStoreConfig } from '../store.js'

const prepareKnowledgeBase = async (docType, path) => {

    try {
        let processedData = await ProcessDoc(docType, path)
        await Chroma.fromDocuments(
            processedData, new OpenAIEmbeddings(), getStoreConfig());
    } catch (err) {
        console.log("failed to process doc", err)
        return err
    }

}


const peekTrainingData = async () => {

    const client = new ChromaClient({
        path: "http://0.0.0.0:8000"
    });
    try {

        const vectorStore = await client.getCollection({ name: "stargate" });
        console.log(await vectorStore.peek())

    } catch (err) {

        console.log("failed to peek training data", err)
    }
}






// prepareKnowledgeBase("dir", "./data/Stargate-doc")

// peekTrainingData()