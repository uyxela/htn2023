import { useEffect, useState } from "react";
import { getPageTitle } from "./utils";
import axios, { AxiosResponse } from "axios";
import { Spinner } from "@chakra-ui/spinner";
import { BLUE, GRAY } from "./colors";

import ThumbsUp from "./assets/thumbsup.png";
import Think from "./assets/think.png";
import ThumbsDown from "./assets/thumbsdown.png";
import Shrug from "./assets/shrug.png";

// const TEMP_sentiment = 0;

export default function Main({
  token,
  setToken,
}: {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isLoadingSummaryAndReviews, setIsLoadingSummaryAndReviews] =
    useState(true);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(true);
  const [isLoadingSentiment, setIsLoadingSentiment] = useState(true);

  const [productId, setProductId] = useState("");

  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [summary, setSummary] = useState("");
  const [reviews, setReviews] = useState<any>("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [sentiment, setSentiment] = useState<string | null>();

  useEffect(() => {
    console.log(productId);
  }, [productId]);

  const loadExistingReview = async (productName: string, brandName: string) => {
    let response: AxiosResponse<any> | undefined;

    try {
      response = await axios.get(
        "http://localhost:9000/extension/product?productName=" +
          productName +
          "&brandName=" +
          brandName
      );
    } catch (error: unknown) {
      return null;
    }

    if (!response) {
      return null;
    }

    setProductId(response.data.id);
    setSummary(response.data.summary);
    setReviews(response.data.reviews);
    setKeywords(response.data.keywords);
    setSentiment(response.data.sentiment);
    setIsLoadingSummaryAndReviews(false);
    setIsLoadingKeywords(false);
    setIsLoadingSentiment(false);

    return true;
  };

  const loadProduct = async (pageTitle: string) => {
    const response = await axios.get(
      `http://localhost:9000/extension/product-details?title=${pageTitle}`
    );

    setProductName(response.data.productName);
    setBrandName(response.data.brandName);
    setIsLoadingProduct(false);

    return [response.data.productName, response.data.brandName];
  };

  const loadReview = async (
    productNameString: string,
    brandNameString: string
  ) => {
    const reviewResponse = await axios.get(
      `http://localhost:9000/extension/review-summary?productName=${productNameString}&brandName=${brandNameString}`
    );

    setSummary(reviewResponse.data.summary);
    setReviews(reviewResponse.data.reviews);
    setIsLoadingSummaryAndReviews(false);

    return reviewResponse.data;
  };

  const loadKeywords = async (summary: string) => {
    const keywordsResponse = await axios.get(
      `http://localhost:9000/extension/summary-keywords?summary=${summary}`
    );

    setKeywords(keywordsResponse.data);
    setIsLoadingKeywords(false);
    return keywordsResponse.data;
  };

  const loadSentiment = async (summary: string) => {
    const sentimentResponse = await axios.get(
      `http://localhost:9000/extension/summary-sentiment?summary=${summary}`
    );

    setSentiment(sentimentResponse.data);
    setIsLoadingSentiment(false);
    return sentimentResponse.data;
  };

  const saveProduct = async ({
    productName,
    brandName,
    summary,
    reviews,
    sentiment,
    keywords,
  }: {
    productName: string;
    brandName: string;
    summary: string;
    reviews: any;
    sentiment: string;
    keywords: string[];
  }) => {
    const response = await axios.post(
      "http://localhost:9000/extension/save-product",
      {
        productName,
        brandName,
        summary,
        reviews,
        sentiment,
        keywords,
      }
    );

    if (response.status === 200) {
      setProductId(response.data.product.id);
      setReviews(response.data.reviews);
    }
  };

  useEffect(() => {
    (async function getProductInfo() {
      const pageTitle = await getPageTitle();

      if (!pageTitle) {
        return;
      }

      const [productNameString, brandNameString] = await loadProduct(pageTitle);

      const existingReview = await loadExistingReview(
        productNameString,
        brandNameString
      );

      if (existingReview) {
        return;
      }

      const review = await loadReview(productNameString, brandNameString);

      console.log("summary", review.summary);

      const [keywordsArray, sentimentString] = await Promise.all([
        loadKeywords(review.summary),
        loadSentiment(review.summary),
      ]);

      await saveProduct({
        productName: productNameString,
        brandName: brandNameString,
        summary: review.summary,
        reviews: review.reviews,
        sentiment: sentimentString,
        keywords: keywordsArray,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoadingProduct) {
    return (
      <div
        style={{
          width: "100vw",
          height: "calc(100vh - 60px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner color={BLUE} />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "480px",
      }}
    >
      {isLoadingProduct ? (
        <div
          style={{
            width: "100vw",
            height: "250px", // Check this value
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner color={BLUE} />
        </div>
      ) : (
        <div
          style={{
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            paddingLeft: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 800,
            }}
          >
            {productName}
          </h1>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 500,
              color: GRAY,
            }}
          >
            {brandName}
          </h3>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            {isLoadingSentiment && (
              <img
                style={{
                  width: "150px",
                }}
                src={Think}
                alt="Think"
              />
            )}
            {sentiment === "positive" && (
              <img
                style={{
                  width: "150px",
                }}
                src={ThumbsUp}
                alt="Thumbs Up"
              />
            )}
            {sentiment === "neutral" && (
              <img
                style={{
                  width: "150px",
                }}
                src={Shrug}
                alt="Shrug"
              />
            )}
            {sentiment === "negative" && (
              <img
                style={{
                  width: "150px",
                }}
                src={ThumbsDown}
                alt="Thumbs Down"
              />
            )}

            {isLoadingKeywords ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "250px",
                  height: "100%",
                }}
              >
                <Spinner color={BLUE} />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  width: "250px",
                }}
              >
                {keywords.map((keyword) => (
                  <div
                    style={{
                      padding: "8px 16px 8px 16px",
                      marginBottom: "4px",
                      borderRadius: "999px",
                      backgroundColor: BLUE,
                      color: "white",
                      fontWeight: 500,
                    }}
                  >
                    {keyword}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {isLoadingSummaryAndReviews ? (
        <div
          style={{
            width: "100%",
            height: "150px", // Check this value
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner color={BLUE} />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "150px", // Check this value
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "20px 40px 20px 40px",
          }}
        >
          <p
            style={{
              color: GRAY,
              fontSize: "14px",
            }}
          >
            {summary}
          </p>

          {reviews.map((document: any, index: number) => (
            <div
              key={document.id ?? index}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #2574EB",
                margin: "15px 0 15px 0",
              }}
            >
              <a
                style={{
                  fontWeight: 600,
                }}
                href={document.url}
                target="_blank"
                rel="noreferrer"
              >
                {document.title}
              </a>

              <p
                style={{
                  color: GRAY,
                  fontSize: "14px",
                }}
              >
                {document.snippet}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
