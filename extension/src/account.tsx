import { useState } from "react";
import { User } from "./types";
import { Input } from "@chakra-ui/react";
import { BLUE, GRAY } from "./colors";
import axios from "axios";

export default function Account({
  user,
  setUser,
}: {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) {
  const [currentPage, setCurrentPage] = useState<string>(
    user ? "Account" : "Login"
  );

  const [inputName, setInputName] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");

  const [localUser, setLocalUser] = useState<User | null>(user);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:9000/auth/login", {
        email: inputEmail,
        password: inputPassword,
      });

      setUser(response.data);
      setLocalUser(response.data);
      chrome.storage.sync.set({ user: response.data });
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:9000/auth/register", {
        name: inputName,
        email: inputEmail,
        password: inputPassword,
      });

      setUser(response.data);
      setLocalUser(response.data);
      chrome.storage.sync.set({ user: response.data });
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    chrome.storage.sync.remove("user");
    setUser(null);
    setLocalUser(null);
    setCurrentPage("Login");
  };

  if (currentPage === "Account" && localUser) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: "100px 40px 0 40px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 600,
            marginBottom: "20px",
          }}
        >
          Hi, {localUser.name}!
        </h1>
        <p
          style={{
            fontSize: "22px",
            fontWeight: 600,
            marginBottom: "20px",
          }}
        >
          Email:{" "}
          <span
            style={{
              fontWeight: 400,
            }}
          >
            {localUser.email}
          </span>
        </p>
        <button
          style={{
            fontSize: "22px",
            fontWeight: 600,
            marginBottom: "20px",
            backgroundColor: BLUE,
            border: "none",
            color: "white",
            borderRadius: "999px",
            padding: "12px 24px 12px 24px",
          }}
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    );
  }

  if (localUser) {
    setCurrentPage("Account");
  }

  if (currentPage === "Login") {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: "100px 40px 0 40px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 600,
            marginBottom: "20px",
          }}
        >
          Log In
        </h1>
        <h1
          style={{
            fontSize: "18px",
            fontWeight: 500,
            color: GRAY,
            marginTop: "8px",
          }}
        >
          Email
        </h1>
        <Input
          value={inputEmail}
          onChange={(event) => setInputEmail(event.target.value)}
        />
        <h1
          style={{
            fontSize: "18px",
            fontWeight: 500,
            color: GRAY,
            marginTop: "8px",
          }}
        >
          Password
        </h1>
        <Input
          type="password"
          value={inputPassword}
          onChange={(event) => setInputPassword(event.target.value)}
        />
        <button
          style={{
            fontSize: "22px",
            fontWeight: 600,
            marginTop: "20px",
            marginBottom: "20px",
            backgroundColor: BLUE,
            border: "none",
            color: "white",
            borderRadius: "999px",
            padding: "8px 18px 8px 18px",
          }}
          onClick={handleLogin}
        >
          Log In
        </button>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: BLUE,
            cursor: "pointer",
          }}
          onClick={() => setCurrentPage("Register")}
        >
          Create an account
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: "60px 40px 0 40px",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: 600,
          marginBottom: "20px",
        }}
      >
        Sign Up
      </h1>
      <h1
        style={{
          fontSize: "18px",
          fontWeight: 500,
          color: GRAY,
          marginTop: "8px",
        }}
      >
        Name
      </h1>
      <Input
        value={inputName}
        onChange={(event) => setInputName(event.target.value)}
      />
      <h1
        style={{
          fontSize: "18px",
          fontWeight: 500,
          color: GRAY,
          marginTop: "8px",
        }}
      >
        Email
      </h1>
      <Input
        value={inputEmail}
        onChange={(event) => setInputEmail(event.target.value)}
      />
      <h1
        style={{
          fontSize: "18px",
          fontWeight: 500,
          color: GRAY,
          marginTop: "8px",
        }}
      >
        Password
      </h1>
      <Input
        type="password"
        value={inputPassword}
        onChange={(event) => setInputPassword(event.target.value)}
      />
      <button
        style={{
          fontSize: "22px",
          fontWeight: 600,
          marginTop: "20px",
          marginBottom: "20px",
          backgroundColor: BLUE,
          border: "none",
          color: "white",
          borderRadius: "999px",
          padding: "8px 18px 8px 18px",
        }}
        onClick={handleRegister}
      >
        Go!
      </button>
      <p
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: BLUE,
          cursor: "pointer",
        }}
        onClick={() => setCurrentPage("Login")}
      >
        Log in to your account
      </p>
    </div>
  );
}
