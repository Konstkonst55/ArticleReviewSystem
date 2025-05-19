import React, { useState, useRef, useEffect } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { submitArticle } from '../../api';

function AuthorSubmitArticle() {

  const { authorInfo } = useOutletContext();
  const location = useLocation();
  const [article, setArticle] = useState(
    location.state?.draftToEdit || {
      title: "",
      category: "",
      content: "",
      tags: "",
      isOriginal: false,
    }
  );
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const contentEditableRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setArticle((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  useEffect(() => {
    if (contentEditableRef.current) {

      contentEditableRef.current.innerHTML = article.content || "";


      if (contentEditableRef.current.innerHTML) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(contentEditableRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);


      }
    }
  }, [article.content, location.state?.draftToEdit]);


  const handleContentChange = () => {
    if (contentEditableRef.current) {
      const content = contentEditableRef.current.innerHTML;
      setArticle((prev) => ({ ...prev, content }));

      if (validationErrors.content) {
        setValidationErrors((prev) => ({ ...prev, content: null }));
      }
    }
  };

  const toggleFormat = (format) => {
    document.execCommand(format, false, null);
    contentEditableRef.current.focus();

  };


  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
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
        alert("Please upload a file in PDF or DOCX format");
        setFile(null);
      }
    } else {
      setFile(null);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!article.title.trim()) errors.title = "Title is required";
    if (!article.category) errors.category = "Please select a category";

    if (!contentEditableRef.current || contentEditableRef.current.innerText.trim() === "") {
      errors.content = "Content is required";
    }

    if (!article.isOriginal)
      errors.isOriginal = "Originality confirmation is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();
    const hasFile = !!file;

    if (!isFormValid || !hasFile) {
      alert(
        "Not all required fields are filled or file is missing. Please complete the form to submit for review."
      );

      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('Title', article.title);
    formData.append('Category', article.category);
    formData.append('Content', article.content);
    formData.append('Tags', article.tags);
    formData.append('IsOriginal', article.isOriginal);
    if (file) {
      formData.append('File', file);
    }

    try {
      const response = await submitArticle(formData);

      console.log('Article submitted successfully:', response.data);

      alert("Article submitted for review successfully!");
      resetForm();
    } catch (error) {
      console.error('Error submitting article:', error);


      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error submitting article: ${error.response.data.message}`);
      } else {
        alert("An error occurred while submitting the article.");
      }

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    const draftArticle = {
      ...article,

      file: file ? { name: file.name, type: file.type } : null,
      status: "Draft",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      author: `${authorInfo.firstName} ${authorInfo.lastName}`,
    };

    console.log("Draft data:", draftArticle);
    alert("Draft saved locally (not to server yet).");
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
    setValidationErrors({});
    if (contentEditableRef.current) {
      contentEditableRef.current.innerHTML = "";
    }
  };

  return (
    <div className="author-submit-article">
      <h2>Submit Article for Review</h2>
      <p>Please fill in all fields below to submit your article for review.</p>

      <form onSubmit={handleSubmitReview}> { }
        <div className="form-section">
          <h2>Article Title</h2>
          <input
            type="text"
            name="title"
            value={article.title}
            onChange={handleChange}
            placeholder="Enter article title"
            className={validationErrors.title ? "error" : ""}
          />
          {validationErrors.title && (
            <span className="error-message">{validationErrors.title}</span>
          )}
        </div>

        <div className="form-section">
          <h2>Category</h2>
          <select
            name="category"
            value={article.category}
            onChange={handleChange}
            className={validationErrors.category ? "error" : ""}
          >
            <option value="">Select category</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Environment">Environment</option>
            <option value="Business">Business</option>
          </select>
          {validationErrors.category && (
            <span className="error-message">{validationErrors.category}</span>
          )}
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
              aria-label="Bulleted list"
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => toggleFormat("insertOrderedList")}
              aria-label="Numbered list"
            >
              1. List
            </button>
          </div>
          <div
            ref={contentEditableRef}
            className={`content-editable ${validationErrors.content ? "error" : ""
              }`}
            contentEditable
            onInput={handleContentChange}
            placeholder="Write your article content here..."
          />
          {validationErrors.content && (
            <span className="error-message">{validationErrors.content}</span>
          )}
        </div>

        <div className="form-section">
          <h2>Article File</h2>
          <div className="file-upload">
            <label
              htmlFor="file-upload"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.docx"
                style={{ display: "none" }}
              />
              <div className={`upload-area ${dragActive ? "drag-active" : ""}`}>
                {file ? (
                  <div className="file-info">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="remove-file"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <span>Drag and drop file here or</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById("file-upload").click();
                      }}
                      className="browse-btn"
                    >
                      Browse files
                    </button>
                    <p className="file-requirements">
                      Supported formats: PDF, DOCX (required for review)
                    </p>
                  </>
                )}
              </div>
            </label>
            { }
            {!file && validationErrors.file && (
              <span className="error-message">{validationErrors.file}</span>
            )}
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
            className={validationErrors.isOriginal ? "error" : ""}
          />
          <label htmlFor="original-work">
            I confirm this is my original work and I have read the article
            submission guidelines
          </label>
          {validationErrors.isOriginal && (
            <span className="error-message">{validationErrors.isOriginal}</span>
          )}
        </div>

        <div className="form-actions">
          { }
          <button type="button" className="draft-btn" onClick={handleSaveDraft}>
            Save as Draft
          </button>
          { }
          <button
            type="submit"
            className="submit-btn"

            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthorSubmitArticle;
