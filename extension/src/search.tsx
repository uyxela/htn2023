import { Icon, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BLUE, GRAY, RED } from "./colors";
import { debounce } from "lodash";

import ThumbsUp from "./assets/thumbsup.png";
import ThumbsDown from "./assets/thumbsdown.png";
import Shrug from "./assets/shrug.png";

export default function Search({
  searchTerm,
  setProductName,
  setBrandName,
  setPage,
}: {
  searchTerm: string;
  setProductName: React.Dispatch<React.SetStateAction<string>>;
  setBrandName: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [products, setProducts] = useState<any>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    (async function func() {
      const response = await axios.get(
        "http://localhost:9000/extension/search?q=" + searchTerm
      );

      const products = response.data;

      setProducts(products);
      setIsLoadingProducts(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {isLoadingProducts && <Spinner mt="200px" color={BLUE} />}

      <p
        style={{
          fontSize: "22px",
          fontWeight: 600,
          marginTop: "20px",
        }}
      >
        Search Results ({products.length}):
      </p>
      <div
        style={{
          padding: "0 20px 0 20px",
        }}
      >
        {products
          .sort((a: any, b: any) => b.users.length - a.users.length)
          .map((product: any) => (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "0 15px 15px 15px",
                borderRadius: "8px",
                border: "1px solid #2574EB",
                margin: "15px 0 15px 0",
                cursor: "pointer",
              }}
              onClick={() => {
                setProductName(product.name);
                setBrandName(product.brand);
                debounce(() => setPage("Home"), 250)();
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                {product.sentiment === "positive" && (
                  <img
                    style={{
                      width: "80px",
                    }}
                    src={ThumbsUp}
                    alt="Thumbs Up"
                  />
                )}
                {product.sentiment === "neutral" && (
                  <img
                    style={{
                      width: "80px",
                      marginBottom: "20px",
                    }}
                    src={Shrug}
                    alt="Shrug"
                  />
                )}
                {product.sentiment === "negative" && (
                  <img
                    style={{
                      width: "80px",
                    }}
                    src={ThumbsDown}
                    alt="Thumbs Down"
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    marginLeft: "30px",
                    width: "140px",
                  }}
                >
                  <p
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    {product.name}
                  </p>

                  <p
                    style={{
                      color: GRAY,
                      fontSize: "14px",
                    }}
                  >
                    {product.brand}
                  </p>
                </div>
                <div
                  style={{
                    width: "100%",
                    paddingRight: "8px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      color: GRAY,
                      fontSize: "14px",
                      fontWeight: 600,
                      marginLeft: "10px",
                    }}
                  >
                    {product.users.length}
                  </p>
                  <Icon
                    viewBox="0 0 512 512"
                    width="20px"
                    height="20px"
                    fill={BLUE}
                  >
                    <path d="M400,480a16,16,0,0,1-10.63-4L256,357.41,122.63,476A16,16,0,0,1,96,464V96a64.07,64.07,0,0,1,64-64H352a64.07,64.07,0,0,1,64,64V464a16,16,0,0,1-16,16Z" />
                  </Icon>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  overflow: "scroll",
                  overflowX: "hidden",
                  overflowY: "hidden",
                }}
              >
                {product.keywords.map((keyword: string) => {
                  const capitalizedKeyword = keyword
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                  return (
                    <div
                      style={{
                        padding: "4px 12px 4px 12px",
                        marginRight: "4px",
                        borderRadius: "999px",
                        backgroundColor: BLUE,
                        color: "white",
                        fontWeight: 500,
                        fontSize: "12px",
                      }}
                    >
                      {capitalizedKeyword}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
