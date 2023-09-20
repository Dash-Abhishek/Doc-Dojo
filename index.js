const { Configuration, OpenAIApi } = require("openai");
const { Invoke, GetFunctionList } = require("./extentions");
require('readline', 'os')
var colors = require('colors/safe');

colors.enable()

var openAIClient = undefined
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

// holds complete chat transcription
const chatHistory = []

/**
 * receives user inputs
 */
function getUserInput() {
    readline.question('User: ', async (input) => {

        await ProcessUserInput({ actor: "user", dialogue: input })

        getUserInput(); // Continue waiting for user input
    });
}


/**
 * Process user input using GPT model
 * @param {*} input  
 */
const ProcessUserInput = async (input) => {

    if (input.actor === "function") {
        chatHistory.push({
            role: input.actor,
            name: input.name,
            content: input.dialogue
        })
    } else {

        chatHistory.push({
            role: input.actor,
            content: input.dialogue
        })

    }


    let client = InitializeOpenAPIClient();
    let res = await client.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages: chatHistory,
        functions: GetFunctionList(),
        function_call: "auto"
    });

    // check for function call
    if (!res.data.choices[0].message.content) {

        // Extracting function details
        console.log(res.data.choices[0].message.function_call)
        let extensionName = res.data.choices[0].message.function_call.name
        let extensionArgs = JSON.parse(res.data.choices[0].message.function_call.arguments)
        console.log(colors.cyan("GTP invoking: "), colors.cyan(extensionName), colors.cyan(extensionArgs))

        // Invoking target function
        let extensionRes = await Invoke(extensionName, extensionArgs)

        console.log(colors.cyan("Got result from function, analyzing....."))
        await ProcessUserInput({ actor: "function", name: extensionName, dialogue: JSON.stringify(extensionRes) })
        return
    }

    // GPT response
    console.log(colors.yellow("Assistant: "), res.data.choices[0].message.content)

    // updating chat history
    chatHistory.push({
        role: "assistant",
        content: res.data.choices[0].message.content
    })
    return

}

/**
 * SingleTon function to initialize GTP client
 * @returns openAIClient
 */
const InitializeOpenAPIClient = () => {

    if (openAIClient !== undefined) {

        return openAIClient
    }
    const configuration = new Configuration({
        apiKey: process.env.API_KEY,
        organization: process.env.ORG
    });
    openAIClient = new OpenAIApi(configuration)
    return openAIClient
}


// driver function
const main = async () => {
    getUserInput()
}


main()




