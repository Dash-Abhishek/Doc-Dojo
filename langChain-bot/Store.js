
export const getStoreConfig = (collectionName) => {
    return {
        collectionName: collectionName,
        url: "http://0.0.0.0:8000", // Optional, will default to this value
        collectionMetadata: {
            "hnsw:space": "cosine",
        }
    }
}


// module.exports = { getStoreConfig };