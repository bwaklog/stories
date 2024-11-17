import "../Story.css";
import React, { useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const MyEditor = ({ title, tags, story, setStory, storyId, setStoryId }) => {
  const editorRef = React.useRef();

  const handleSave = async () => {
    const markdownContent = editorRef.current.getInstance().getMarkdown();
    console.log("Text typed: ", markdownContent);

    const jwtToken = localStorage.getItem("jwt");
    console.log("JWT Token retrieved: ", jwtToken);
    const author = localStorage.getItem("author");

    if (!title.trim()) {
      alert("Please provide a title before saving.");
      return;
    }

    console.log("story object: ", story);

    const payload = {
      author,
      content: markdownContent,
      title: title,
      draft: false,
      tags: tags.length > 0 ? tags : [],
    };

    const postStory = async () => {
      try {
        const response = await fetch("http://localhost:4000/stories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Story created, story id is: ", data.id);
          setStory(data);
          setStoryId(data.id); 
        } else {
          console.log("Error creating story: ", response.statusText);
          const errorData = await response.json();
          console.log("Error details: ", errorData);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    const putStory = async () => {
      try {
        const response = await fetch(`http://localhost:4000/stories`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ ...payload, id: storyId }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Story updated, story id is: ", storyId);
          setStory(data);
        } else {
          console.log("Error updating story: ", response.statusText);
          const errorData = await response.json();
          console.log("Error details: ", errorData);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    if (storyId) {
      await putStory();
    } else {
      await postStory();
    }
  };

  return (
    <div className="mde">
      <Editor
        ref={editorRef}
        initialValue="Start writing your story here..."
        height="500px"
        initialEditType="markdown"
        previewStyle="vertical"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

function SideBar({ title, setTitle, tags, setTags }) {
  const [currentTag, setCurrentTag] = React.useState("");

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentTag.trim()) {
        setTags([...tags, currentTag.trim()]);
        setCurrentTag("");
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="sidebar">
      <button className="share">Share</button>
      <div className="title-input">
        <h3>Story Title</h3>
        <input
          required
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter story title"
        />
        <h3>Tags</h3>
        <div className="tags-container">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}{" "}
              <button onClick={() => removeTag(index)} className="remove-tag">
                &times;
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          className="tag-input"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Enter tags"
        />
      </div>
    </div>
  );
}

export default function Story() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [story, setStory] = useState(null);
  const [storyId, setStoryId] = useState(null);

  return (
    <div>
      <SideBar
        title={title}
        setTitle={setTitle}
        tags={tags}
        setTags={setTags}
      />
      <MyEditor
        title={title}
        tags={tags}
        story={story}
        setStory={setStory}
        storyId={storyId}
        setStoryId={setStoryId}
      />
    </div>
  );
}
