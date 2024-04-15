import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  const searchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${query}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.items);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{ query, setQuery, loading, error, users, searchUsers }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

/* A A Designs */
