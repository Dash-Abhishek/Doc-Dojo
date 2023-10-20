import { Chroma } from "langchain/vectorstores/chroma";
import { ProcessDoc } from './document.js';
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { getStoreConfig } from './Store.js'

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



const queryKnowledgeBase = async (inputQuery) => {

    try {
        const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
        const vectorStore = await Chroma.fromExistingCollection(
            new OpenAIEmbeddings(),
            {
                collectionName: "a-test-collection",
                url: "http://0.0.0.0:8000"
            }
        );
        const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
        const response = await chain.call({
            query: inputQuery,
        });
        return response
    } catch (err) {
        console.log("failed to query", err)
        return err
    }


}


// prepareKnowledgeBase("file", "./ADA-FSD-Resume-v1.pdf")
// queryKnowledgeBase("what all documents you have access to ?").then((res) => {
//     console.log(res)
// })