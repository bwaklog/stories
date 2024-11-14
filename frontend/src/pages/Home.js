import "../Home.css";
import React from "react";

const tags = ["Personal", "Adventure", "Fun", "Sad", "Happy", "Kid Friendly"];

function handleLogout() {
   localStorage.removeItem("jwt");
   window.location.href = "/";
}

function LeftSideBar() {
  return (
    <div className="left-sidebar">
      <div className="nav">
        <button>Home</button>
        <button>Explore</button>
        <button>Search Stories</button>
        <button onClick={() => window.location.href = "http://localhost:3000/story"}>Write a story &#9998;</button>
      </div>
      <div className="profile">
        <button>View Profile</button>
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
  return (
    <div className="card-container">
      {[...Array(6)].map((_, index) => (
        <div key={index}>
          <h3>Heading</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      ))}
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