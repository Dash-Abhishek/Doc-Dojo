
export const getStoreConfig = () => {
    return {
        collectionName: "collection-name",
        url: "http://0.0.0.0:8000", // Optional, will default to this value
        collectionMetadata: {
            "hnsw:space": "cosine",
        }
    }
}
