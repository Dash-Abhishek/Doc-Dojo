const fs = require("fs")
const axios = require("axios")

function GetFunctionList() {

    return [
        {
            "name": "GetAPIs",
            "description": "fetches list apis of a company, the data includes api name, description, product category, tags & consumer count for each api",
            "parameters": {
                "type": "object",
                "properties": {
                    "companyName": {
                        "type": "string",
                        "description": "name of company"
                    }

                }
            }
        },
        {
            "name": "GetRepoIssues",
            "description": "lists all the issues of a given repository url",
            "parameters": {
                "type": "object",
                "properties": {
                    "repoUrl": {
                        "type": "string",
                        "description": "url of repository"
                    }

                }
            }
        },

    ]
}


async function GetAPIs(args) {

    console.log("listing apis of", args)
    try {
        let data = await fs.readFileSync("./data/apis.json")
        return JSON.parse(data)
    } catch (err) {
        console.log("failed to extract data", err)
        return {}
    }

}


async function GetRepoIssues(args) {
    console.log(args.repoUrl)
    let issues = []
    const options = {
        headers: {
            "Authorization": "Bearer: " + process.env.GIT_TOKEN,
            "Accept": "application/vnd.github+json"
        }
    }
    try {
        let res = await axios.get(args.repoUrl, options)

        if (res.status == 200) {
            for (let i = 0; i < res.data.length; i++) {
                issues.push(res.data[i].body)
            }
        }

    } catch (err) {
        console.log("failed to fetch issues of repo", args.repoLink)
    }
    return issues
}



async function Invoke(functionName, args) {

    switch (functionName) {
        case "GetAPIs":
            return await GetAPIs(args)

        case "GetConsumerCountOfAPI":
            return await GetConsumerCountOfAPI(args)

        case "GetRepoIssues":
            return await GetRepoIssues(args)

        default:
            return "function is not supported";
    }

}

module.exports = { Invoke, GetFunctionList, GetAPIs, GetRepoIssues }




// GetRepoIssues({ repoLink: "https://api.github.com/repos/kumahq/kuma/issues" })

