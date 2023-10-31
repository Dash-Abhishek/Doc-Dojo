import config from "config";
export const getStoreConfig = () => {
    return {
        collectionName: config.get("vectorStore.primaryCollection"),
        url: config.get("vectorStore.host"),
        collectionMetadata: {
            "hnsw:space": "cosine",
        }
    }
}
