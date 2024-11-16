import React, { useEffect, useState } from "react";
import "../Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState({ username: "", email: "", stories: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          setError("You need to log in to view your profile.");
          return;
        }

        const response = await fetch("http://localhost:4000/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUserData({
            username: data.username,
            email: data.email,
            stories: data.stories,
          });
        } else {
          setError(data.message || "Failed to fetch profile data.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("An error occurred. Please try again.");
      }
    };
    fetchUserProfile();
  }, []);

    return (
        <div className="profile-container">
      <h1>User Profile</h1>

      {error && <p className="error-message">{error}</p>}

      {!error && (
        <>
          <div className="profile-details">
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>

          <div className="profile-stories">
            <h2>Your Stories</h2>
            {userData.stories.length > 0 ? (
              <ul>
                {userData.stories.map((story, index) => (
                  <li key={index}>
                    <h3>{story.title}</h3>
                    <p>{story.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You haven't written any stories yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;