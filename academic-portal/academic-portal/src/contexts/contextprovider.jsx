import { useState, createContext, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_APP_KEY;
const encryptionKey = secretKey;

const StateContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export const ContextProvider = ({ children }) => {
  // Retrieve the encrypted user from sessionStorage
  const [user, _setUser] = useState(() => {
    const encryptedUser = sessionStorage.getItem("USER_DATA");
    if (encryptedUser) {
      const bytes = CryptoJS.AES.decrypt(encryptedUser, encryptionKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return null;
  });

  // Retrieve token from sessionStorage
  const [token, _setToken] = useState(() => sessionStorage.getItem("ACCESS_TOKEN"));

  // Function to update token in state and sessionStorage
  const setToken = (token) => {
    _setToken(token);
    if (token) {
      sessionStorage.setItem("ACCESS_TOKEN", token); // Store token in sessionStorage
    } else {
      sessionStorage.removeItem("ACCESS_TOKEN"); // Remove token from sessionStorage
    }
  };

  // Function to update user in state and sessionStorage
  const setUser = (user) => {
    _setUser(user);
    if (user) {
      const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), encryptionKey).toString();
      sessionStorage.setItem("USER_DATA", encryptedUser); // Store encrypted user data in sessionStorage
    } else {
      sessionStorage.removeItem("USER_DATA"); // Remove user data from sessionStorage
    }
  };

  // Effect to debug state initialization
  useEffect(() => {
    console.log("User initialized:", user);
    console.log("Token initialized:", token);
  }, [user, token]);

  return (
    <StateContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </StateContext.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook to use state context
export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a ContextProvider");
  }
  return context;
};
