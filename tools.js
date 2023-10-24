import { readFileSync } from "fs"

export const GetApis = async (data) => {
    console.log("COMPANY NAME:", data)
    try {
        let data = await readFileSync("./data/apis.json")
        return JSON.stringify(JSON.parse(data))
    } catch (err) {
        console.log("failed to extract data", err)
        return {}
    }

}
