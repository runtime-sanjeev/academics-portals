import { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_APP_KEY || "default-secret-key"; // Ensure fallback key
const encryptionKey = secretKey;

const StateContext = createContext(null);

export const ContextProvider = ({ children }) => {
  // Retrieve user from sessionStorage with decryption
  const [user, _setUser] = useState(() => {
    const encryptedUser = sessionStorage.getItem("USER_DATA"); // Get from sessionStorage
    if (encryptedUser) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedUser, encryptionKey);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedData ? JSON.parse(decryptedData) : null;
      } catch (error) {
        console.error("Failed to decrypt user data:", error);
        sessionStorage.removeItem("USER_DATA"); // Remove corrupted data
      }
    }
    return null;
  });

  // Retrieve token from sessionStorage
  const [token, _setToken] = useState(() => sessionStorage.getItem("ACCESS_TOKEN") || null);

  // Function to update token in state and sessionStorage
  const setToken = (newToken) => {
    _setToken(newToken);
    if (newToken) {
      sessionStorage.setItem("ACCESS_TOKEN", newToken);
    } else {
      sessionStorage.removeItem("ACCESS_TOKEN");
    }
  };

  // Function to update user in state and sessionStorage
  const setUser = (newUser) => {
    _setUser(() => newUser); // Functional update to avoid extra re-renders
    if (newUser) {
      try {
        const encryptedUser = CryptoJS.AES.encrypt(
          JSON.stringify(newUser),
          encryptionKey
        ).toString();
        sessionStorage.setItem("USER_DATA", encryptedUser);
      } catch (error) {
        console.error("Failed to encrypt user data:", error);
      }
    } else {
      sessionStorage.removeItem("USER_DATA");
    }
  };

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
