import { CloudClient, type Collection } from "chromadb";
import { OllamaEmbeddingFunction } from "@chroma-core/ollama";
import chalk from "chalk";

const client = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: "80c2b572-10dd-4b83-a20d-500149f4f5c5",
  database: "supportly",
});

let generalKb: Collection | null = null;

export async function initChroma() {
  console.log(chalk.blue("[chroma] Initializing ChromaDB client and general_kb collection"));
  generalKb = await client.getOrCreateCollection({
    name: "general_kb",
    embeddingFunction: new OllamaEmbeddingFunction({
      model: "embeddinggemma:latest",
    }),
  });
  console.log(chalk.green("[chroma] general_kb collection ready"));
}

export async function getChroma() {
  return { client, generalKb };
}
