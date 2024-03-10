"use client";

import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);
const { Provider } = AuthContext;

const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: "",
    user: {},
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    setAuthState({ token, user });
  }, []);

  const setUserAuthInfo = (data) => {
    const token = localStorage.setItem("token", data.token);
    const user = localStorage.setItem("user", JSON.stringify(data.user));
    setAuthState({ token, user });
  };

  const isUserAuthenticated = () => {
    return !!authState.token; 
  };

  return (
    <Provider
      value={{
        authState,
        setUserAuthInfo,
        isUserAuthenticated,
      }}
    >
      {children} /* // baaki ka sab*/
    </Provider>
  );
};

export { AuthProvider, useAuth };
