// Document loader
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"



const WebDataLoader = {

    async loadDocument(path) {
        const loader = new CheerioWebBaseLoader(path);
        const data = await loader.load();
        return data;
    }

}

const FileDataLoader = {

    async loadDocument(path) {
        const loader = new PDFLoader(path);
        const data = await loader.load();
        return data;
    }

}
const dataLoaderFactory = (sourceType) => {

    switch (sourceType) {
        case "web":
            return WebDataLoader;
        default:
            return FileDataLoader;
    }
}

const splitDoc = async (data) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 0,
    });

    const splitDocs = await textSplitter.splitDocuments(data);
    return splitDocs;

}

export const ProcessDoc = async (sourceType, path) => {

    let loader = dataLoaderFactory(sourceType)
    let data = await loader.loadDocument(path)
    return await splitDoc(data)

}



