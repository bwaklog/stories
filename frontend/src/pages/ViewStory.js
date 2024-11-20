import React, { useEffect } from "react";
import { FaHome, FaUserCircle } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../ViewStory.css";

const ViewStory = () => {
  const { storyId } = useParams();
  const { state } = useLocation();
  const { storyData } = state || {};
  const [isLoading, setIsLoading] = React.useState(true);
  const [storydata, setstorydata] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        console.log("storyId: ", storyId);
        const response = await fetch(`http://localhost:4000/stories?id=${storyId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
          }
        });
        console.log("response: ", response);
        if (response.ok) {
          const data = await response.json();
          setstorydata(Array.isArray(data) ? data[0] : data);
        } else {
          console.error("Error fetching story data.");
          setstorydata(null);
        }
      } catch (error) {
        console.error("Error: ", error);
        setstorydata(null);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchStory();
  }, [storyId]);
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!storydata) {
    return <div>No story data available</div>;
  }

  const openHome = () => {
    window.location.href = "/home";
  }

  const openProfile = () => {
    window.location.href = "/profile";
  };

  const currentUser = localStorage.getItem("author");

  function editStory() {
    const coAuthors = Array.isArray(storyData.co_authors) ? storyData.co_authors : [];
    if (coAuthors.includes(currentUser) && storyData.co_author !== null) {
      console.log("id: ", storyData.id);
      return (
        <button
          onClick={() => {
            navigate("/story", { state: { storyData, isEditFromView: true } });
          }}
        >
          Edit as co-author
        </button>
      );
    } else {
      if (currentUser === storyData.author) {
        console.log("id: ", storyData.id);
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
      <FaHome className="home-icon" onClick={openHome} size={30} />
      <FaUserCircle className="profile-icon" onClick={openProfile} size={30} />
      <div className="story-header"></div>
      <div className="story-details">
        <h2>
          <strong>{storydata.metadata.title}</strong>
        </h2>
        <h3 className="author-heading">Written By: {storydata.author}</h3>
        {editStory()}
      </div>
      <div className="story-content">
        <ReactMarkdown>{storydata.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ViewStory;
