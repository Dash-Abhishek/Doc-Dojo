// Document loader
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { TextLoader } from "langchain/document_loaders/fs/text"
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"




const WebDataLoader = {

    async loadDocuments(path) {
        const loader = new CheerioWebBaseLoader(path);
        const data = await loader.load();
        return data;
    }

}

const DirDataLoader = {

    async loadDocuments(path) {

        const loader = new DirectoryLoader(path,
            {
                ".pdf": (path) => new PDFLoader(path),
                ".txt": (path) => new TextLoader(path),
            });

        let data = await loader.load();
        return data;
    }

}

const dataLoaderFactory = (sourceType) => {

    switch (sourceType) {
        case "dir":
            return DirDataLoader;
        default:
            return DirDataLoader;
    }
}

const splitDoc = async (data) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 0,
    });

    const splitDocs = await textSplitter.splitDocuments(data);
    return splitDocs;

}

export const ProcessDoc = async (sourceType, path) => {

    let loader = dataLoaderFactory(sourceType)
    let data = await loader.loadDocuments(path)
    return await splitDoc(data)

}



