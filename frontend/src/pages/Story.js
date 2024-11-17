import "../Story.css";
import React, { useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const MyEditor = ({ title, tags }) => {
  const editorRef = React.useRef();
  const [story, setStory] = useState(null);

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

    try {
      const response = await fetch("http://localhost:4000/stories", {
        method: story ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          id: story ? story.id : null,
          author: author,
          content: markdownContent,
          title: title,
          draft: false,
          tags: tags.length > 0 ? tags : [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Content saved: ", data);
        setStory(data);
      } else {
        console.log("Error saving content: ", response.statusText);
        const errorData = await response.json();
        console.log("Error details: ", errorData);
      }
    } catch (error) {
      console.log("Error: ", error);
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
  return (
    <div>
      <SideBar
        title={title}
        setTitle={setTitle}
        tags={tags}
        setTags={setTags}
      />
      <MyEditor title={title} tags={tags} />
    </div>
  );
}