import "../Story.css";
import React, { useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import '@toast-ui/editor/dist/toastui-editor.css';

const MyEditor = ({ title }) => {
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
   
      try {
         const response = await fetch("http://localhost:4000/stories", {
            method: "POST",
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ 
               author: author,
               content: markdownContent,
               title: title,
               draft: false, 
            })
         });
   
         if (response.ok) {
            const data = await response.json();
            console.log("Content saved: ", data);
         } else {
            console.log("Error saving content: ", response.statusText);
            const errorData = await response.json();
            console.log("Error details: ", errorData);
         }
      } catch (error) {
         console.log("Error: ", error);
      }
      alert("Story saved successfully!");
   };
   

   return (
      <div className="mde">
         <Editor
            ref={editorRef}
            initialValue="Hello, Toast UI Editor!"
            height="500px"
            initialEditType="markdown"
            previewStyle="vertical"
         />
         <button onClick={handleSave}>Save</button>
      </div>
   );
}

function SideBar({ title, setTitle }) {
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
      </div>
    </div>
  );
}

export default function Story() {
   const [title, setTitle] = useState("");
   return (
      <div>
         <SideBar title={title} setTitle={setTitle} />
         <MyEditor title={title} />
      </div>
   );
}
