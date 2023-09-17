import { useEffect, useState } from "react";
import { getPageTitle } from "./utils";
import axios, { AxiosResponse } from "axios";
import { Spinner } from "@chakra-ui/spinner";
import { BLUE, GRAY, LIGHT_GRAY, RED } from "./colors";

import ThumbsUp from "./assets/thumbsup.png";
import Think from "./assets/think.png";
import ThumbsDown from "./assets/thumbsdown.png";
import Shrug from "./assets/shrug.png";
import { User } from "./types";
import { Icon } from "@chakra-ui/react";

export default function Main({
  user,
  productNameProp = "",
  brandNameProp = "",
  bookmarks,
  setBookmarks,
  likes,
  setLikes,
}: {
  user: User | null;
  productNameProp?: string;
  brandNameProp?: string;
  bookmarks: any;
  setBookmarks: React.Dispatch<React.SetStateAction<any>>;
  likes: any;
  setLikes: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [isLoadingProduct, setIsLoadingProduct] = useState(
    !(productNameProp && brandNameProp)
  );
  const [isLoadingSummaryAndReviews, setIsLoadingSummaryAndReviews] =
    useState(true);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(true);
  const [isLoadingSentiment, setIsLoadingSentiment] = useState(true);

  const [productId, setProductId] = useState("");

  const [productName, setProductName] = useState(productNameProp);
  const [brandName, setBrandName] = useState(brandNameProp);
  const [summary, setSummary] = useState("");
  const [reviews, setReviews] = useState<any>("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [sentiment, setSentiment] = useState<string | null>();

  const [localBookmarks, setLocalbookmarks] = useState<any>(bookmarks);
  const [localLikes, setLocalLikes] = useState<any>(likes);

  useEffect(() => {
    setLocalbookmarks(bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    setLocalLikes(likes);
  }, [likes]);

  const handleBookmarkClick = async () => {
    if (bookmarks.some((bookmark: any) => bookmark.id === productId)) {
      const response = await axios.delete(
        `http://localhost:9000/extension/bookmarks?productId=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        setBookmarks(
          bookmarks.filter((bookmark: any) => bookmark.id !== productId)
        );
        setLocalbookmarks(
          localBookmarks.filter((bookmark: any) => bookmark.id !== productId)
        );
      }
    } else {
      const response = await axios.post(
        "http://localhost:9000/extension/bookmarks",
        {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        setBookmarks([...bookmarks, response.data]);
        setLocalbookmarks([...localBookmarks, response.data]);
      }
    }
  };

  const handleLikeClick = async (documentId: string) => {
    if (likes.some((like: any) => like.id === documentId)) {
      const response = await axios.delete(
        `http://localhost:9000/extension/likes?documentId=${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        setLikes(likes.filter((like: any) => like.id !== documentId));
        setLocalLikes(localLikes.filter((like: any) => like.id !== documentId));
      }
    } else {
      const response = await axios.post(
        "http://localhost:9000/extension/likes",
        {
          documentId,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        setLikes([...likes, response.data]);
        setLocalLikes([...localLikes, response.data]);
      }
    }
  };

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

    console.log(response.data);

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
    if (productName !== "" && brandName !== "") {
      return [productName, brandName];
    }

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
  }, [productNameProp, brandNameProp]);

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
        paddingBottom: "60px",
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
              marginTop: "15px",
              marginBottom: "15px",
              fontSize: "32px",
              lineHeight: "38px",
              fontWeight: 800,
            }}
          >
            {productName}
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: GRAY,
              }}
            >
              {brandName}
            </h3>
            {productId && user && (
              <Icon
                viewBox="0 0 512 512"
                width="20px"
                height="20px"
                fill={
                  localBookmarks.some(
                    (bookmark: any) => bookmark.id === productId
                  )
                    ? BLUE
                    : LIGHT_GRAY
                }
                onClick={productId && user ? handleBookmarkClick : () => {}}
                style={{
                  cursor: productId && user ? "pointer" : "default",
                  marginLeft: "10px",
                }}
              >
                <path d="M400,480a16,16,0,0,1-10.63-4L256,357.41,122.63,476A16,16,0,0,1,96,464V96a64.07,64.07,0,0,1,64-64H352a64.07,64.07,0,0,1,64,64V464a16,16,0,0,1-16,16Z" />
              </Icon>
            )}
          </div>
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
                  width: "200px",
                }}
                src={Think}
                alt="Think"
              />
            )}
            {sentiment === "positive" && (
              <img
                style={{
                  width: "200px",
                }}
                src={ThumbsUp}
                alt="Thumbs Up"
              />
            )}
            {sentiment === "neutral" && (
              <img
                style={{
                  width: "200px",
                  marginBottom: "30px",
                }}
                src={Shrug}
                alt="Shrug"
              />
            )}
            {sentiment === "negative" && (
              <img
                style={{
                  width: "200px",
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
                {keywords.map((keyword) => {
                  const capitalizedKeyword = keyword
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                  return (
                    <div
                      style={{
                        padding: "8px 16px 8px 16px",
                        marginBottom: "7px",
                        borderRadius: "999px",
                        backgroundColor: BLUE,
                        color: "white",
                        fontWeight: 500,
                      }}
                    >
                      {capitalizedKeyword}
                    </div>
                  );
                })}
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
              marginBottom: "20px",
            }}
          >
            {summary}
          </p>

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "26px",
                fontWeight: 600,
                color: GRAY,
              }}
            >
              Reviews
            </h2>
          </div>

          {reviews.map((document: any, index: number) => (
            <div
              key={document.id ?? index}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #2574EB",
                margin: "15px 0 15px 0",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <a
                  style={{
                    fontWeight: 600,
                  }}
                  href={document.url ?? document.link}
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
              <Icon
                viewBox="0 0 512 512"
                width="20px"
                height="20px"
                fill={
                  user
                    ? likes.some((like: any) => like.id === document.id)
                      ? RED
                      : LIGHT_GRAY
                    : "white"
                }
                onClick={
                  document.id && user
                    ? () => handleLikeClick(document.id)
                    : () => {}
                }
                style={{
                  cursor: document.id && user ? "pointer" : "default",
                  marginLeft: "10px",
                }}
              >
                <path d="M256,448a32,32,0,0,1-18-5.57c-78.59-53.35-112.62-89.93-131.39-112.8-40-48.75-59.15-98.8-58.61-153C48.63,114.52,98.46,64,159.08,64c44.08,0,74.61,24.83,92.39,45.51a6,6,0,0,0,9.06,0C278.31,88.81,308.84,64,352.92,64,413.54,64,463.37,114.52,464,176.64c.54,54.21-18.63,104.26-58.61,153-18.77,22.87-52.8,59.45-131.39,112.8A32,32,0,0,1,256,448Z" />
              </Icon>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
