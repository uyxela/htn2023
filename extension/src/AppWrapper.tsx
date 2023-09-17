import { createContext, useState } from "react";

const AuthContext = createContext<
  { loggedIn: false; token: null } | { loggedIn: true; token: string }
>({
  loggedIn: false,
  token: null,
});

const SetAuthContext = createContext<
  React.Dispatch<
    React.SetStateAction<
      { loggedIn: false; token: null } | { loggedIn: true; token: string }
    >
  >
>(() => {
  throw new Error("No SetAuthContext provided");
});

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

export default function AppWrapper({ children }: Props) {
  const [loggedIn, setLoggedIn] = useState<
    { loggedIn: false; token: null } | { loggedIn: true; token: string }
  >({
    loggedIn: false,
    token: null,
  });

  return (
    <AuthContext.Provider value={loggedIn}>
      <SetAuthContext.Provider value={setLoggedIn}>
        {children}
      </SetAuthContext.Provider>
    </AuthContext.Provider>
  );
}
