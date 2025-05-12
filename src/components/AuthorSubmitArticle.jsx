// import React, { useState } from "react";

// function AuthorSubmitArticle() {
//   const [article, setArticle] = useState({
//     title: "",
//     category: "",
//     content: "",
//     tags: "",
//     isOriginal: false,
//   });
//   const [file, setFile] = useState(null);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setArticle((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Submitting:", { article, file });
//   };

//   return (
//     <div className="author-submit-article">
//       <h2>Submit Article for Review</h2>
//       <p>Please fill in the details below to submit your article for review.</p>

//       <form onSubmit={handleSubmit}>
//         <div className="form-section">
//           <h2>Article Title</h2>
//           <input
//             type="text"
//             name="title"
//             value={article.title}
//             onChange={handleChange}
//             placeholder="Enter article title"
//             required
//           />
//         </div>

//         <div className="form-section">
//           <h2>Category</h2>
//           <select
//             name="category"
//             value={article.category}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select a category</option>
//             <option value="Technology">Technology</option>
//             <option value="Healthcare">Healthcare</option>
//             <option value="Environment">Environment</option>
//             <option value="Business">Business</option>
//           </select>
//         </div>

//         <div className="form-section">
//           <h2>Article Content</h2>
//           <div className="editor-toolbar">
//             <button type="button">B</button>
//             <button type="button">I</button>
//             <button type="button">💬</button>
//             <button type="button">💷</button>
//             <button type="button">💸</button>
//           </div>
//           <textarea
//             name="content"
//             value={article.content}
//             onChange={handleChange}
//             placeholder="Write your article content here..."
//             required
//           />
//         </div>

//         <div className="form-section">
//           <h2>Featured Image</h2>
//           <div className="file-upload">
//             <label>
//               <input
//                 type="file"
//                 onChange={handleFileChange}
//                 accept=".pdf,.docx"
//               />
//               <span>Drag and drop your image here or</span>
//               <button type="button">Browse Files</button>
//             </label>
//           </div>
//         </div>

//         <div className="form-section">
//           <h2>Tags</h2>
//           <input
//             type="text"
//             name="tags"
//             value={article.tags}
//             onChange={handleChange}
//             placeholder="Enter tags separated by commas"
//           />
//         </div>

//         <div className="form-checkbox">
//           <input
//             type="checkbox"
//             id="original-work"
//             name="isOriginal"
//             checked={article.isOriginal}
//             onChange={handleChange}
//             required
//           />
//           <label htmlFor="original-work">
//             I confirm that this article is my original work and I have read and
//             agree to the submission guidelines
//           </label>
//         </div>

//         <div className="form-actions">
//           <button type="button" className="draft-btn">
//             Save Draft
//           </button>
//           <button type="submit" className="submit-btn">
//             Submit for Review
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default AuthorSubmitArticle;

import React, { useState, useRef, useEffect } from "react";

function AuthorSubmitArticle({ onSaveDraft, onSubmitReview }) {
  const [article, setArticle] = useState({
    title: "",
    category: "",
    content: "",
    tags: "",
    isOriginal: false,
  });
  const [file, setFile] = useState(null);
  const contentEditableRef = useRef(null);

  useEffect(() => {
    if (contentEditableRef.current) {
      contentEditableRef.current.textContent = article.content;
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setArticle((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContentChange = () => {
    if (contentEditableRef.current) {
      setArticle((prev) => ({
        ...prev,
        content: contentEditableRef.current.innerHTML,
      }));
    }
  };

  const toggleFormat = (format) => {
    document.execCommand(format, false, null);
    contentEditableRef.current.focus();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        alert("Please upload a PDF or DOCX file");
      }
    }
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    const newArticle = {
      ...article,
      id: Date.now(),
      status: "Draft",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    onSaveDraft(newArticle);
    resetForm();
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const newArticle = {
      ...article,
      id: Date.now(),
      status: "Under Review",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    onSubmitReview(newArticle);
    resetForm();
  };

  const resetForm = () => {
    setArticle({
      title: "",
      category: "",
      content: "",
      tags: "",
      isOriginal: false,
    });
    setFile(null);
    if (contentEditableRef.current) {
      contentEditableRef.current.innerHTML = "";
    }
  };

  return (
    <div className="author-submit-article">
      <h2>Submit Article for Review</h2>
      <p>Please fill in the details below to submit your article for review.</p>

      <form>
        <div className="form-section">
          <h2>Article Title</h2>
          <input
            type="text"
            name="title"
            value={article.title}
            onChange={handleChange}
            placeholder="Enter article title"
            required
          />
        </div>

        <div className="form-section">
          <h2>Category</h2>
          <select
            name="category"
            value={article.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Environment">Environment</option>
            <option value="Business">Business</option>
          </select>
        </div>

        <div className="form-section">
          <h2>Article Content</h2>
          <div className="editor-toolbar">
            <button
              type="button"
              onClick={() => toggleFormat("bold")}
              aria-label="Bold"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => toggleFormat("italic")}
              aria-label="Italic"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => toggleFormat("insertUnorderedList")}
              aria-label="Bullet List"
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => toggleFormat("insertOrderedList")}
              aria-label="Numbered List"
            >
              1. List
            </button>
          </div>
          <div
            ref={contentEditableRef}
            className="content-editable"
            contentEditable
            onInput={handleContentChange}
            placeholder="Write your article content here..."
          />
        </div>

        <div className="form-section">
          <h2>Featured Image</h2>
          <div className="file-upload">
            <label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx"
                style={{ display: "none" }}
                id="file-upload"
              />
              <div className="upload-area">
                {file ? (
                  <div className="file-info">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="remove-file"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <span>Drag and drop your file here or</span>
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("file-upload").click()
                      }
                      className="browse-btn"
                    >
                      Browse Files
                    </button>
                    <p className="file-requirements">
                      Accepted formats: PDF, DOCX
                    </p>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2>Tags</h2>
          <input
            type="text"
            name="tags"
            value={article.tags}
            onChange={handleChange}
            placeholder="Enter tags separated by commas"
          />
        </div>

        <div className="form-checkbox">
          <input
            type="checkbox"
            id="original-work"
            name="isOriginal"
            checked={article.isOriginal}
            onChange={handleChange}
            required
          />
          <label htmlFor="original-work">
            I confirm that this article is my original work and I have read and
            agree to the submission guidelines
          </label>
        </div>
        <div className="form-actions">
          <button type="button" className="draft-btn" onClick={handleSaveDraft}>
            Save Draft
          </button>
          <button
            type="button"
            className="submit-btn"
            onClick={handleSubmitReview}
          >
            Submit for Review
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthorSubmitArticle;
