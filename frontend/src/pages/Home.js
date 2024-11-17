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

function RightSideBar() {
  return (
    <div className="right-sidebar">
      <h3 style={{ margin: 0, marginBottom: 5 }}>Mini Tags Explorer</h3>
      <div className="tags-buttons">
        {tags.map((tag, index) => (
          <button style={{ margin: 3 }} key={index}>
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function MainContent() {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("http://localhost:4000/stories", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        const story = await response.json();
        setStories(story);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStories();
  }, []);

  const viewStory = (storyData) => {
    navigate("/viewStory", { state: { storyData } });
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
        <p>Loading stories...</p>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="container">
      <LeftSideBar />
      <MainContent />
      <RightSideBar />
    </div>
  );
}