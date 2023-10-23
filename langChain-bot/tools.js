import { readFileSync } from "fs"

export const GetApis = async (data) => {
    console.log("data", data)
    try {
        let data = await readFileSync("./data/apis.json")
        // return JSON.parse(data)
        return "there are 3 api , stargate, MOP, &  booking engine"
    } catch (err) {
        console.log("failed to extract data", err)
        return {}
    }

}
