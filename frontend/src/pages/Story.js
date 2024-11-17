import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "../Story.css";

const MyEditor = ({
  title,
  tags,
  story,
  setStory,
  storyId,
  setStoryId,
  coAuthors,
  setCoAuthors,
  isEdit,
}) => {
  const editorRef = React.useRef();

  const handleSave = async () => {
    const markdownContent = editorRef.current.getInstance().getMarkdown();

    const jwtToken = localStorage.getItem("jwt");
    const author = localStorage.getItem("author");

    if (!title.trim()) {
      alert("Please provide a title before saving.");
      return;
    }

    const payload = {
      author,
      content: markdownContent,
      title: title,
      draft: false,
      tags: tags.length > 0 ? tags : [],
      co_authors: coAuthors,
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
          alert("Story saved");
          setStory(data);
          setStoryId(data.id);
        } else {
          alert("Error saving story");
        }
      } catch (error) {
        console.error("Error: ", error);
        alert("Error saving story");
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
          alert("Story saved");
          setStory(data);
        } else {
          alert("Error saving story");
        }
      } catch (error) {
        console.error("Error: ", error);
        alert("Error saving story");
      }
    };

    if (story && isEdit) {
      await putStory();
    } else {
      await postStory();
    }
  };

  return (
    <div className="mde">
      <Editor
        ref={editorRef}
        initialValue={story?.content || "Start writing your story here..."}
        height="500px"
        initialEditType="markdown"
        previewStyle="vertical"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

const SideBar = ({
  title,
  setTitle,
  tags,
  setTags,
  coAuthors,
  setCoAuthors,
}) => {
  const [currentTag, setCurrentTag] = React.useState("");
  const [currentCoAuthor, setCurrentCoAuthor] = React.useState("");

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

  const handleAddCoAuthor = () => {
    if (currentCoAuthor.trim()) {
      setCoAuthors([...coAuthors, currentCoAuthor.trim()]);
      setCurrentCoAuthor("");
    }
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
          placeholder="Tag name and Enter"
        />
      </div>

      <div className="co-author">
        <h3>Co-Authors</h3>
        <input
          type="text"
          value={currentCoAuthor}
          onChange={(e) => setCurrentCoAuthor(e.target.value)}
          placeholder="Enter co-author name"
        />
        <button onClick={handleAddCoAuthor}>Add</button>
        <div>
          {coAuthors.length > 0 && (
            <ul>
              {coAuthors.map((coAuthor, index) => (
                <li key={index}>{coAuthor}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Story() {
  const { state } = useLocation();
  const { storyData, isEdit } = state || {};
  console.log("Story Data: ", storyData);
  const [title, setTitle] = useState(storyData?.metadata?.title || "");
  const [tags, setTags] = useState(storyData?.metadata?.tags || []);
  const [story, setStory] = useState(storyData || {});
  const [storyId, setStoryId] = useState(storyData?._id || null);
  const [coAuthors, setCoAuthors] = useState(storyData?.co_authors || []);

  return (
    <div>
      <SideBar
        title={title}
        setTitle={setTitle}
        tags={tags}
        setTags={setTags}
        coAuthors={coAuthors}
        setCoAuthors={setCoAuthors}
      />
      <MyEditor
        title={title}
        tags={tags}
        story={story}
        setStory={setStory}
        storyId={storyId}
        setStoryId={setStoryId}
        coAuthors={coAuthors}
        setCoAuthors={setCoAuthors}
        isEdit={isEdit}
      />
    </div>
  );
}
