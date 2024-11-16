import React from "react";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import "../ViewStory.css";

const ViewStory = () => {
  const handleBack = () => {
    window.location.href = "/home";
  };

  const openProfile = () => {
    window.location.href = "/profile";
  };

  const storyData = JSON.parse(localStorage.getItem("storyData"));

  return (
    <div className="view-story">
      <div className="story-header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft size={24} />
        </button>
        <h1>{storyData.title}</h1>
        <button className="profile-button" onClick={openProfile}>
          <FaUserCircle size={32} />
        </button>
      </div>
      <div className="story-details">
        <h2>{storyData.title}need to figure out tittle code</h2>
        <h3 className="author-heading">Written By: {storyData.author}</h3>
      </div>
      <div className="story-content">
        <p>{storyData.content}</p>
      </div>
    </div>
  );
};

export default ViewStory;
