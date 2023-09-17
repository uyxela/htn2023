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

export async function getReviewSummary(productName: string, brandName: string) {
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
        prompt_truncation: "AUTO",
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

  const titleSet = new Set<string>();

  response.data.documents.forEach((document: any) => {
    titleSet.add(document.title);
  });

  const filteredReviews = Array.from(titleSet).map((title) =>
    response.data.documents.find((document: any) => document.title === title)
  );

  const linkSet = new Set<string>();

  filteredReviews.forEach((review) => {
    linkSet.add(review.url);
  });

  const finalFilteredReviews = Array.from(linkSet).map((link) =>
    filteredReviews.find((review) => review.url === link)
  );

  const formattedResponse = {
    summary: response.data.text,
    reviews: finalFilteredReviews,
  };

  return formattedResponse;
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

export async function getSummarySentiment(summary: string) {
  let sentiment: string | undefined;

  try {
    const response = await cohere.classify({
      model: "embed-english-v2.0",
      inputs: [summary],
      examples: [
        { text: "The order came 5 days early", label: "positive" },
        { text: "The item exceeded my expectations", label: "positive" },
        { text: "I ordered more for my friends", label: "positive" },
        { text: "I would buy this again", label: "positive" },
        { text: "I would recommend this to others", label: "positive" },
        { text: "The package was damaged", label: "negative" },
        { text: "The order is 5 days late", label: "negative" },
        { text: "The order was incorrect", label: "negative" },
        { text: "I want to return my item", label: "negative" },
        { text: "The item's material feels low quality", label: "negative" },
        { text: "The product arrived yesterday", label: "neutral" },
        { text: "I used the product this morning", label: "neutral" },
        { text: "I bought it from the website", label: "neutral" },
        { text: "The product was okay", label: "neutral" },
        { text: "It's not as bad as I expected", label: "neutral" },
      ],
    });

    sentiment = response.body.classifications[0]?.prediction;
  } catch (error: unknown) {
    console.log(error);
  }

  return sentiment ?? "positive";
}
