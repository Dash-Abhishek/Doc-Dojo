import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Chroma } from "langchain/vectorstores/chroma";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicTool } from "langchain/tools";
import { GetApis } from '../tools.js'


export const ChatProcessor = {


    queryKnowledgeBase: async (inputQuery) => {

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


    },


    queryUsingTools: async (inputQuery) => {

        const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
        const tools = [
            new DynamicTool({
                name: "getAPIs",
                description:
                    "fetches list apis of a company, the data includes api name, description, product category, tags & consumer count.",
                func: GetApis,
            }),

        ];
        const executor = await initializeAgentExecutorWithOptions(tools, model, {
            agentType: "chat-conversational-react-description",
            verbose: true,
        });
        const response = await executor.run({
            query: inputQuery,
        });


        console.log(response)
    }

}
