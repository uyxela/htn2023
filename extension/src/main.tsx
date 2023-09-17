import { useEffect, useState } from "react";
import { getPageTitle } from "./utils";
import axios from "axios";
import { Spinner } from "@chakra-ui/spinner";
import { BLUE, GRAY } from "./colors";

import ThumbsUp from "./assets/thumbsup.png";

// const TEMP_sentiment = 0;

export default function Main({
  token,
  setToken,
}: {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isLoadingReview, setIsLoadingReview] = useState(true);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(true);

  const [productName, setProductName] = useState("Loading...");
  const [brandName, setBrandName] = useState("Loading...");

  const [reviewObj, setReviewObj] = useState<string | any>("Loading...");

  const [keywords, setKeywords] = useState<string[]>([]);

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

    setReviewObj(reviewResponse.data);
    setIsLoadingReview(false);

    return reviewResponse.data;
  };

  const loadKeywords = async (summary: string) => {
    const keywordsResponse = await axios.get(
      `http://localhost:9000/extension/summary-keywords?summary=${summary}`
    );

    setKeywords(keywordsResponse.data);
    setIsLoadingKeywords(false);
  };

  useEffect(() => {
    (async function getProductInfo() {
      const pageTitle = await getPageTitle();

      if (!pageTitle) {
        return;
      }

      const [productNameString, brandNameString] = await loadProduct(pageTitle);

      const review = await loadReview(productNameString, brandNameString);

      await loadKeywords(review.text);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoadingProduct && isLoadingReview) {
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
            <img
              style={{
                width: "150px",
              }}
              src={ThumbsUp}
              alt="Thumbs Up"
            />
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
      {isLoadingReview ? (
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
            {reviewObj.text}
          </p>

          {reviewObj.documents.map((document: any) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                padding: "30px 15px 30px 15px",
                borderRadius: "8px",
                border: "1px solid #2574EB",
                margin: "15px 0 15px 0",
              }}
            >
              <a href={document.url} target="_blank" rel="noreferrer">
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
