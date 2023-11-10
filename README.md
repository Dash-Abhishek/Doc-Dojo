# Doc-Dojo

Simple LLM bot platform built to learn from documents and answers questions related to it.

## Dependencies:
- Vector Store ChromaDB
- LLM OPENAI
- Node.JS v18



## Usage:

* Development
    * Clone repo
    `git clone https://github.com/Dash-Abhishek/GPT-bot`
    * Install dependencies
    `npm install`

    * Vectore Store  ChromaDb setup:
    `docker run -p 8000:8000 -d chromadb/chroma`
    * Set env variable
    `export OPENAI_API_KEY=<your key>`
    * Load data into chromadb:
        *  place all docs in txt or pdf format in data folder
        *  run `npm run learn`

    * Start chat server
    `npm run start`
    * Query
    ```
    curl  -X POST \
  'localhost:3000/conversation' \
  --header 'Accept: */*' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "userMessage":"your question"
    }'
    ```

* Deploy
      
    - Place all docs in txt or pdf format in data folder
        
    - Run

          NODE_CONFIG='{"vectorStore":{"host":"http://chromaDB:8000"}}' OPENAI_API_KEY=<KEY> docker compose up -d
    
## License (MIT)
Copyright (c) 2022 Abhishek Dash

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.