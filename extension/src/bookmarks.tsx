import { BLUE, GRAY } from "./colors";

import ThumbsUp from "./assets/thumbsup.png";
import ThumbsDown from "./assets/thumbsdown.png";
import Shrug from "./assets/shrug.png";
import { debounce } from "lodash";

export default function Bookmarks({
  bookmarks = [],
  likes = [],
  searchTerm,
  setProductName,
  setBrandName,
  setPage,
}: {
  bookmarks: any;
  likes: any;
  searchTerm: string;
  setProductName: React.Dispatch<React.SetStateAction<string>>;
  setBrandName: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}) {
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
      <p
        style={{
          fontSize: "22px",
          fontWeight: 600,
          marginTop: "20px",
        }}
      >
        Bookmarks ({bookmarks.length}):
      </p>
      <div
        style={{
          padding: "0 20px 0 20px",
        }}
      >
        {bookmarks.map((bookmark: any) => (
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
              setProductName(bookmark.name);
              setBrandName(bookmark.brand);
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
              {bookmark.sentiment === "positive" && (
                <img
                  style={{
                    width: "80px",
                  }}
                  src={ThumbsUp}
                  alt="Thumbs Up"
                />
              )}
              {bookmark.sentiment === "neutral" && (
                <img
                  style={{
                    width: "80px",
                    marginBottom: "20px",
                  }}
                  src={Shrug}
                  alt="Shrug"
                />
              )}
              {bookmark.sentiment === "negative" && (
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
                }}
              >
                <p
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {bookmark.name}
                </p>

                <p
                  style={{
                    color: GRAY,
                    fontSize: "14px",
                  }}
                >
                  {bookmark.brand}
                </p>
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
              {bookmark.keywords.map((keyword: string) => {
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

      <p
        style={{
          fontSize: "22px",
          fontWeight: 600,
          marginTop: "40px",
        }}
      >
        Liked Reviews ({likes.length}):
      </p>
      <div
        style={{
          padding: "0 20px 0 20px",
        }}
      >
        {likes.map((document: any, index: number) => (
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
              cursor: "pointer",
            }}
            onClick={() => window.open(document.url ?? document.link, "_blank")}
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
        ))}
      </div>
    </div>
  );
}
