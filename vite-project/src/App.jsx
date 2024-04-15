import React, { useState, useContext } from "react";
import "./App.css";

// Create a new context
const GithubContext = React.createContext();

// Create a custom hook to use the GithubContext
export const useGithubContext = () => {
  return useContext(GithubContext);
};

// Create a GithubProvider component to manage the state
export const GithubProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  const searchUsers = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${query}`
      );
      const data = await response.json();

      if (response.ok) {
        setUsers(data.items);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <GithubContext.Provider value={{ loading, error, users, searchUsers }}>
      {children}
    </GithubContext.Provider>
  );
};

// Create a Search component
const Search = () => {
  const { loading, error, users, searchUsers } = useGithubContext();
  const [query, setQuery] = useState("");

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    searchUsers(query);
  };

  return (
    <div
      style={{
        fontfamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Git Users Search App
      </h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for users..."
          style={{
            padding: "8px",
            marginRight: "10px",
            width: "70%",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 20px",
            borderRadius: "4px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
          }}
        >
          Search
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error fetching {error}</p>}
      {!loading && !error && users.length === 0 && <p>No results...</p>}
      {!loading && !error && users.length > 0 && (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {users.map((user) => (
            <li
              key={user.id}
              style={{
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "4px",
                backgroundColor: "none",
              }}
            >
              {user.login}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Example usage:
const App = () => {
  return (
    <GithubProvider>
      <Search />
    </GithubProvider>
  );
};

export default App;

/* A A Designs */
