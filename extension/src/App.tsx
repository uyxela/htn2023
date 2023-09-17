import { useEffect, useState } from "react";
import Main from "./main";
import { Icon, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { BLUE, LIGHT_GRAY } from "./colors";
import Search from "./search";
import Account from "./account";
import Bookmarks from "./bookmarks";
import { User } from "./types";
import axios from "axios";
// import { debounce } from "lodash";

function App() {
  // const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const [page, setPage] = useState<string>("Home");

  const [user, setUser] = useState<User | null>(null);

  const [bookmarks, setBookmarks] = useState<any>([]);
  const [likes, setLikes] = useState<any>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");

  useEffect(() => {
    chrome.storage.sync.get("user", (result) => {
      if (result) {
        setUser(result.user);
      }
    });
  }, [page]);

  useEffect(() => {
    if (user) {
      (async function func() {
        const [bookmarksResponse, likesResponse] = await Promise.all([
          axios.get("http://localhost:9000/extension/bookmarks/", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }),
          axios.get("http://localhost:9000/extension/likes/", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }),
        ]);

        const bookmarksData = bookmarksResponse.data;
        const likesData = likesResponse.data;

        setBookmarks(bookmarksData);
        setLikes(likesData);
      })();
    }
  }, [user]);

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        overflowY: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        <Icon
          viewBox="0 0 512 512"
          width="24px"
          height="24px"
          fill={
            page === "Home" && productName === "" && brandName === ""
              ? LIGHT_GRAY
              : BLUE
          }
          style={{
            cursor:
              page === "Home" && productName === "" && brandName === ""
                ? "default"
                : "pointer",
          }}
          onClick={() => {
            setProductName("");
            setBrandName("");
            setPage("Home");
          }}
        >
          <path d="M261.56,101.28a8,8,0,0,0-11.06,0L66.4,277.15a8,8,0,0,0-2.47,5.79L63.9,448a32,32,0,0,0,32,32H192a16,16,0,0,0,16-16V328a8,8,0,0,1,8-8h80a8,8,0,0,1,8,8l0,136a16,16,0,0,0,16,16h96.06a32,32,0,0,0,32-32l0-165.06a8,8,0,0,0-2.47-5.79Z" />
          <path d="M490.91,244.15l-74.8-71.56,0-108.59a16,16,0,0,0-16-16h-48a16,16,0,0,0-16,16l0,32L278.19,40.62C272.77,35.14,264.71,32,256,32h0c-8.68,0-16.72,3.14-22.14,8.63L21.16,244.13c-6.22,6-7,15.87-1.34,22.37A16,16,0,0,0,43,267.56L250.5,69.28a8,8,0,0,1,11.06,0L469.08,267.56a16,16,0,0,0,22.59-.44C497.81,260.76,497.3,250.26,490.91,244.15Z" />
        </Icon>
        <InputGroup w="300px" ml="20px" mr="20px">
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search items..."
            borderRadius="9999px"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setPage("Search");
              }
            }}
          />
          <InputRightElement
            style={{
              cursor: "pointer",
            }}
            onClick={() => setPage("Search")}
          >
            <SearchIcon />
          </InputRightElement>
        </InputGroup>
        <Icon
          viewBox="0 0 512 512"
          width="24px"
          height="24px"
          fill={page !== "Account" ? BLUE : LIGHT_GRAY}
          onClick={() => setPage("Account")}
          style={{ marginRight: "12px", cursor: "pointer" }}
        >
          <path d="M332.64,64.58C313.18,43.57,286,32,256,32c-30.16,0-57.43,11.5-76.8,32.38-19.58,21.11-29.12,49.8-26.88,80.78C156.76,206.28,203.27,256,256,256s99.16-49.71,103.67-110.82C361.94,114.48,352.34,85.85,332.64,64.58Z" />
          <path d="M432,480H80A31,31,0,0,1,55.8,468.87c-6.5-7.77-9.12-18.38-7.18-29.11C57.06,392.94,83.4,353.61,124.8,326c36.78-24.51,83.37-38,131.2-38s94.42,13.5,131.2,38c41.4,27.6,67.74,66.93,76.18,113.75,1.94,10.73-.68,21.34-7.18,29.11A31,31,0,0,1,432,480Z" />
        </Icon>
        <Icon
          viewBox="0 0 512 512"
          width="24px"
          height="24px"
          fill={page !== "Bookmarks" ? BLUE : LIGHT_GRAY}
          onClick={() => setPage("Bookmarks")}
          style={{
            cursor: "pointer",
          }}
        >
          <path d="M400,480a16,16,0,0,1-10.63-4L256,357.41,122.63,476A16,16,0,0,1,96,464V96a64.07,64.07,0,0,1,64-64H352a64.07,64.07,0,0,1,64,64V464a16,16,0,0,1-16,16Z" />
        </Icon>
      </div>
      {page === "Home" && (
        <Main
          key={productName + brandName}
          user={user}
          productNameProp={productName}
          brandNameProp={brandName}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          likes={likes}
          setLikes={setLikes}
        />
      )}
      {page === "Search" && (
        <Search
          searchTerm={searchTerm}
          setProductName={setProductName}
          setBrandName={setBrandName}
          setPage={setPage}
        />
      )}
      {page === "Account" && <Account user={user} setUser={setUser} />}
      {page === "Bookmarks" && (
        <Bookmarks
          bookmarks={bookmarks}
          likes={likes}
          searchTerm={searchTerm}
          setProductName={setProductName}
          setBrandName={setBrandName}
          setPage={setPage}
        />
      )}
    </div>
  );
}

export default App;
