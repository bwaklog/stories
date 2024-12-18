import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
  setIsEdit,
  draft,
  isEditFromView,
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
      draft: draft,
      tags: tags.length > 0 ? tags : [],
      co_authors: coAuthors,
    };

    // Determine if this is a new story or an edit
    if (storyId) {
      // PUT method (Edit existing story)
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
            alert("Story updated");
            setStory(data);
          } else {
            alert("Error updating story");
            console.log("response:", response.json());
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Error updating story");
        }
      };

      putStory();
    } else {
      // POST method (Create new story)
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
            alert("Story created");
            setStory(data);
            setStoryId(data.id); // Set the ID for further updates
            setIsEdit(true);
          } else {
            alert("Error creating story");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Error creating story");
        }
      };

      postStory();
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
  draft,
  setDraft,
  storyId
}) => {
  const [currentTag, setCurrentTag] = React.useState("");
  const [currentCoAuthor, setCurrentCoAuthor] = React.useState("");
  const navigate = useNavigate();

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

  const handleDraftChange = (e) => {
    setDraft(e.target.checked);
  };

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/viewStory/${storyId}`);
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="sidebar">
      <div className="icons">
        <FaHome onClick={() => navigate("/home")} className="home-icon" />
        <FaUserCircle onClick={() => navigate("/profile")} className="profile-icon" />
      </div>
      <button className="share" onClick={copyToClipboard}>Share</button>
      <div className="title-input">
        <h4>Story Title</h4>
        <input
          required
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter story title"
        />
        <h4>Tags</h4>
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
        <h4>Co-Authors</h4>
        <div className="co-authors-container">
          {coAuthors.map((coAuthor, index) => (
            <span key={index} className="co-author-item">
              {coAuthor}{" "}
              <button
                onClick={() =>
                  setCoAuthors(coAuthors.filter((_, i) => i !== index))
                }
                className="remove-co-author"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          className="co-author-input"
          value={currentCoAuthor}
          onChange={(e) => setCurrentCoAuthor(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && currentCoAuthor.trim()) {
              e.preventDefault();
              setCoAuthors([...coAuthors, currentCoAuthor.trim()]);
              setCurrentCoAuthor("");
            }
          }}
          placeholder="Co-author name and Enter"
        />
      </div>
      <div className="draft">
        <h3>Draft?</h3>
        <input type="checkbox" id="draft-checkbox" onChange={handleDraftChange} />
      </div>
    </div>
  );
};

export default function Story() {
  const { state } = useLocation();
  const { storydata, isEditFromView = true } = state || {};
  const [title, setTitle] = useState(storydata?.metadata?.title || "");
  const [tags, setTags] = useState(storydata?.metadata?.tags || []);
  const [isEdit, setIsEdit] = useState(false);
  const [story, setStory] = useState(storydata || {});
  const [storyId, setStoryId] = useState(storydata?.id || null);
  const [draft, setDraft] = useState(false);
  const [coAuthors, setCoAuthors] = useState(storydata?.co_authors || []);

  return (
    <div>
      <SideBar
        title={title}
        setTitle={setTitle}
        tags={tags}
        setTags={setTags}
        coAuthors={coAuthors}
        setCoAuthors={setCoAuthors}
        draft={draft}
        setDraft={setDraft}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        storyId={storyId}
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
        setIsEdit={setIsEdit}
        draft={draft}
        isEditFromView={isEditFromView}
      />
    </div>
  );
}
