import React from "react";
import { FaUserCircle } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import "../ViewStory.css";

const ViewStory = () => {
  const handleBack = () => {
    window.history.back();
  };

  const openProfile = () => {
    window.location.href = "/profile";
  };

  const storyData = JSON.parse(localStorage.getItem("storyData"));
  console.log("Story Data Received: ", storyData);

  return (
    <div className="view-story">
      <div className="icons-container">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <button className="home-button" onClick={handleBack}>
          Home
        </button>
        <button className="profile-button" onClick={openProfile}>
          <FaUserCircle size={32} />
        </button>
      </div>
      <div className="story-header"></div>
      <div className="story-details">
        <h2>
          <strong>{storyData.metadata.title}</strong>
        </h2>
        <h3 className="author-heading">Written By: {storyData.author}</h3>
      </div>
      <div className="story-content">
        <ReactMarkdown>{storyData.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ViewStory;