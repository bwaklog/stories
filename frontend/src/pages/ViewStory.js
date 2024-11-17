import React from "react";
import { FaUserCircle } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { useLocation, useNavigate } from "react-router-dom";
import "../ViewStory.css";

const ViewStory = () => {
  const { state } = useLocation();
  const { storyData } = state || {};
  const navigate = useNavigate();

  if (!storyData) {
    return <div>No story data available</div>;
  }

  const handleBack = () => {
    window.history.back();
  };

  const openProfile = () => {
    window.location.href = "/profile";
  };

  const currentUser = localStorage.getItem("author");

  function editStory() {
    const coAuthors = Array.isArray(storyData.co_authors) ? storyData.co_authors : [];
    if (coAuthors.includes(currentUser) && storyData.co_author !== null) {
      return (
        <button
          onClick={() => {
            navigate("/story", { state: { storyData, isEdit: true } });
          }}
        >
          Edit as co-author
        </button>
      );
    } else {
      if (currentUser === storyData.author) {
        return (
          <button
            onClick={() => {
              navigate("/story", { state: { storyData, isEdit: true } });
            }}
          >
            Edit
          </button>
        );
      }
    }
  }

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
        {editStory()}
      </div>
      <div className="story-content">
        <ReactMarkdown>{storyData.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ViewStory;
