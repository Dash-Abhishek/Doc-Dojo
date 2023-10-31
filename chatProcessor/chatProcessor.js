import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Chroma } from "langchain/vectorstores/chroma";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicTool } from "langchain/tools";
import { PromptTemplate } from "langchain/prompts";
import { GetApis } from '../tools.js'
import config from "config"


export const ChatProcessor = {



    queryKnowledgeBase: async (inputQuery) => {

        const template = `Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Use three sentences maximum and keep the answer as concise as possible.
Always say "thanks for asking!" at the end of the answer.
{context}
Question: {question}
Helpful Answer:`;

        try {
            const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });

            const vectorStore = await Chroma.fromExistingCollection(
                new OpenAIEmbeddings({
                    openAIApiKey: process.env.OPENAI_API_KEY
                }),
                {
                    collectionName: config.get("vectorStore.primaryCollection"),
                    url: config.get("vectorStore.host"),
                }
            );
            const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(),
                { prompt: PromptTemplate.fromTemplate(template), });

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
                    "fetches list apis of a company, the data includes api name, description, product category, tags & consumer count. call this function with company name as argument",
                func: GetApis,
            }),

        ];
        const executor = await initializeAgentExecutorWithOptions(tools, model, {
            agentType: "chat-conversational-react-description",
            verbose: true,
        });
        const response = await executor.call({
            query: inputQuery,
        });


        console.log(response)
    }

}
