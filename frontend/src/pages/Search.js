import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import "../Search.css";

const Search = () => {
  const [queryType, setQueryType] = useState("author");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query) {
      setError(`Please enter a ${queryType} to search.`);
      setResults([]);
      return;
    }

    setSearched(true);

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("You need to log in to perform a search.");
        setResults([]);
        return;
      }

      const url = `http://localhost:4000/stories?${queryType}=${query}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        if (data.length === 0) {
          setResults([]);
          setError("No stories found.");
        } else {
          setResults(data);
          setError("");
        }
      } else {
        setResults([]);
        setError(data.error || "Failed to fetch stories.");
      }
    } catch (err) {
      setResults([]);
      setError("An error occurred. Please try again.");
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleHome = () => {
    window.location.href = "/home";
  };

  return (
    <div>
      <div className="icons-container">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <button className="home-button" onClick={handleHome}>
          Home
        </button>
      </div>
      <a href="/profile" className="profile-icon">
        <FaUserCircle size={30} />
      </a>
      <div className="search-container">
        <h1>Search Stories</h1>
        <div className="search-form">
          <label>
            <select
              value={queryType}
              onChange={(e) => setQueryType(e.target.value)}
            >
              <option value="author">Author/Co-Author</option>
              <option value="id">Story ID</option>
              <option value="tag">Tag</option>
            </select>
          </label>
          <input
            type="text"
            placeholder={`Enter ${queryType}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className={`error-message ${error ? "visible" : "hidden"}`}>
          {error}
        </div>
      </div>
      {searched && results.length > 0 && (
        <div className="results-box">
          <h1>Results</h1>
          <div className="results-container">
            <ul>
              {results.map((story, index) => (
                <li key={index}>
                  <h3>{story.metadata.title}</h3>
                  <p>{story.content}</p>
                  <p>
                    <strong>Author:</strong>{" "}
                    {story.metadata.author || story.author || "Unknown"}
                  </p>
                  {story.metadata.coAuthors?.length > 0 && (
                    <p>
                      <strong>Co-Authors:</strong>{" "}
                      {story.metadata.coAuthors.join(", ")}
                    </p>
                  )}
                  {story.metadata.tags?.length > 0 && (
                    <p>
                      <strong>Tags:</strong> {story.metadata.tags.join(", ")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
