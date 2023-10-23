import { Chroma } from "langchain/vectorstores/chroma";
import { ProcessDoc } from './document.js';
import { OpenAIEmbeddings } from "langchain/embeddings/openai"

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






// prepareKnowledgeBase("file", "./ADA-FSD-Resume-v1.pdf")
// queryKnowledgeBase("what all documents you have access to ?").then((res) => {
//     console.log(res)
// })