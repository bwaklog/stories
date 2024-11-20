import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "../Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    stories: [],
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const username = localStorage.getItem("author");

        if (!token || !username) {
          setError("You need to log in to view your profile.");
          return;
        }

        const profileResponse = await fetch(
          `http://localhost:4000/user/${username}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profileData = await profileResponse.json();

        if (profileResponse.ok) {
          const storiesResponse = await fetch(
            `http://localhost:4000/stories?author=${username}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const storiesData = await storiesResponse.json();

          if (storiesResponse.ok) {
            setUserData({
              username: profileData.username,
              email: profileData.email,
              stories: storiesData,
            });
          } else {
            setError(storiesData.error || "Failed to fetch stories.");
          }
        } else {
          setError(profileData.error || "Failed to fetch profile data.");
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleHome = () => {
    window.location.href = "/home";
  };

  const handleStoryClick = (storyData) => {
    navigate(`/viewstory/${storyData.id}`, { state: { storyData } });
  };

  return (
    <div>
      <FaHome className="icon" onClick={handleHome} />
      <div className="profile-container">
        <h1>User Profile</h1>
        <div className={`error-message ${error ? "visible" : "hidden"}`}>
          {error}
        </div>
        {!error && (
          <div className="profile-details">
            <p>
              <strong>Username:</strong> {userData.username}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
          </div>
        )}
      </div>
      <div className="stories-container">
        <h1>Stories Written</h1>
        {userData.stories.length > 0 ? (
          <ul>
            {[...userData.stories].reverse().map((story, index) => (
              <li key={index} onClick={() => handleStoryClick(story)}>
                <h3>{story.metadata.title}</h3>
                <p>{story.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No stories written yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
