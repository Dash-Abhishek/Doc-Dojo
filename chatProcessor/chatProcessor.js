import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Chroma } from "langchain/vectorstores/chroma";
import { PromptTemplate } from "langchain/prompts";
import config from "config"
import { RunnablePassthrough, RunnableSequence, } from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";

export const ChatProcessor = {

    queryKnowledgeBase: async (inputQuery) => {

        const template = `Use the following pieces of context to answer the question at the end.
If you do not have any context respond that you dont have an answer for it, do not make up any answer.
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
            const chain = RunnableSequence.from([
                {   
                    context: vectorStore.asRetriever().pipe(formatDocumentsAsString),
                    question: new RunnablePassthrough(),
                },
                PromptTemplate.fromTemplate(template),
                model,
                new StringOutputParser()
            ])

            return await chain.invoke(inputQuery);
            
        } catch (err) {
            console.log("failed to query", err)
            return err
        }


    },
}


const formatDocumentsAsString = (documents, separator) => {
    return documents.map((doc) => doc.pageContent).join(separator);
}