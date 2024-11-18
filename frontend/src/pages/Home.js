import "../Home.css";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const tags = ["Personal", "Adventure", "Fun", "Sad", "Happy", "Kid Friendly"];

function handleLogout() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("author");
  localStorage.removeItem("storyData");
  window.location.href = "/";
}

function viewProfile() {
  window.location.href = "/profile";
}

function searchStories() {
  window.location.href = "/search";
}

function LeftSideBar() {
  return (
    <div className="left-sidebar">
      <div className="nav">
        <button onClick={searchStories}>Search Stories</button>
        <button
          onClick={() => (window.location.href = "http://localhost:3000/story")}
        >
          Write a story &#9998;
        </button>
      </div>
      <div className="profile">
        <button onClick={viewProfile}>View Profile</button>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
}

function RightSideBar({ selectedTags, toggleTag }) {
  return (
    <div className="right-sidebar">
      <h3 style={{ margin: 0, marginBottom: 5 }}>Mini Tags Explorer</h3>
      <div className="tags-buttons">
        {tags.map((tag, index) => (
          <button
            key={index}
            className={`tag-button ${
              selectedTags.includes(tag) ? "selected" : ""
            }`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function MainContent({ selectedTags }) {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      let url = "http://localhost:4000/stories";
      if (selectedTags.length > 0) {
        url += `?tag=${selectedTags.join(",")}`;
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        const data = await response.json();

        if (Array.isArray(data)) {
          setStories(data); 
        } else {
          console.error("Data returned is not an array:", data);
          setStories([]);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, [selectedTags]);

  const viewStory = (storyData) => {
    console.log(storyData);
    navigate(`/viewStory/${storyData._id}`, { state: { storyData } });
  };

  return (
    <div className="card-container">
      {stories.length > 0 ? (
        stories.map((story, index) => (
          <div key={index} onClick={() => viewStory(story)}>
            <h3>{story.metadata.title}</h3>
            <p>
              <strong>Author: </strong> {story.author}
            </p>
            <ReactMarkdown>{story.content}</ReactMarkdown>
          </div>
        ))
      ) : (
        <p>No stories found.</p>
      )}
    </div>
  );
}

export default function Home() {
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tag) => {
    setSelectedTags(
      (prevSelectedTags) =>
        prevSelectedTags.includes(tag)
          ? prevSelectedTags.filter((t) => t !== tag) // Deselect tag
          : [...prevSelectedTags, tag] // Select tag
    );
  };

  return (
    <div className="container">
      <LeftSideBar />
      <MainContent selectedTags={selectedTags} />
      <RightSideBar selectedTags={selectedTags} toggleTag={toggleTag} />
    </div>
  );
}