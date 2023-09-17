import { useState } from "react";
import Main from "./main";

function App() {
  const [page, setPage] = useState<string>("Home");

  const [token, setToken] = useState<string | null>(null);

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "30px",
          paddingRight: "30px",
        }}
      >
        <p>Account</p>
        <p>Bookmark</p>
      </div>
      <Main token={token} setToken={setToken} />
    </div>
  );
}

export default App;
