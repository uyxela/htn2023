import axios from "axios";
import cohere from "cohere-ai";

const COHERE_CHAT_URL = "https://api.cohere.ai/v1/chat";

cohere.init(process.env.COHERE_API_KEY!);

export async function getProductName(title: string) {
  console.log(`Extracting product name from ${title}`);

  let productName: string | undefined = "";

  try {
    const response = await cohere.generate({
      model: "command",
      prompt: `extract only the product name from the title:${title}`,
      max_tokens: 400,
      temperature: 0,
      k: 0,
      p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop_sequences: [],
      return_likelihoods: "NONE",
    });

    productName = response.body.generations[0]?.text;
  } catch (error: unknown) {
    console.log(error);
  }

  return productName;
}

export async function getBrandName(title: string) {
  console.log(`Extracting brand name from ${title}`);

  let brandName: string | undefined = "";

  try {
    const response = await cohere.generate({
      model: "command",
      prompt: `extract only the brand name from the title:${title}`,
      max_tokens: 400,
      temperature: 0,
      k: 0,
      p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop_sequences: [],
      return_likelihoods: "NONE",
    });

    brandName = response.body.generations[0]?.text;
  } catch (error: unknown) {
    console.log(error);
  }

  return brandName;
}

export async function summarizeProductReviews(
  productName: string,
  brandName: string
) {
  console.log(`Summarizing reviews for the ${productName} by ${brandName}`);

  let response: any;

  try {
    response = await axios.post(
      COHERE_CHAT_URL,
      {
        message: `Summarize reviews for the ${productName} by ${brandName}`,
        model: "command-nightly",
        connectors: [
          {
            id: "web-search",
          },
        ],
        temperature: 0,
        stream: false,
        prompt_truncation: "OFF",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    console.log(error);
  }

  return response;
}

export async function getSummaryKeywords(summary: string) {
  let keywords: string[] | undefined;

  try {
    const response = await cohere.generate({
      prompt: `give a comma-separated list of keywords from this:${summary}`,
      model: "command",
      max_tokens: 300,
      temperature: 0,
    });

    keywords = response.body.generations[0]?.text
      .split(",")
      .map((keyword) => keyword.trim());
  } catch (error: unknown) {
    console.log(error);
  }

  return keywords ?? [];
}
