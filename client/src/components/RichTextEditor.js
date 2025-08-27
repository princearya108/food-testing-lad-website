import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder = "Write your content here..." }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet',
    'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          height: '300px',
          marginBottom: '50px'
        }}
      />
      <style jsx global>{`
        .ql-editor {
          min-height: 200px;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .ql-toolbar {
          border-top: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-radius: 8px 8px 0 0;
        }
        
        .ql-container {
          border-bottom: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-radius: 0 0 8px 8px;
          font-family: inherit;
        }
        
        .ql-editor h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 1rem 0;
          color: #1f2937;
        }
        
        .ql-editor h2 {
          font-size: 2rem;
          font-weight: bold;
          margin: 0.875rem 0;
          color: #374151;
        }
        
        .ql-editor h3 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.75rem 0;
          color: #374151;
        }
        
        .ql-editor h4 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.625rem 0;
          color: #4b5563;
        }
        
        .ql-editor p {
          margin: 0.5rem 0;
          line-height: 1.7;
        }
        
        .ql-editor ul, .ql-editor ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        
        .ql-editor li {
          margin: 0.25rem 0;
          line-height: 1.6;
        }
        
        .ql-editor blockquote {
          border-left: 4px solid #3b82f6;
          margin: 1rem 0;
          padding-left: 1rem;
          font-style: italic;
          background-color: #f8fafc;
          padding: 1rem;
          border-radius: 0 8px 8px 0;
        }
        
        .ql-editor code {
          background-color: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
        }
        
        .ql-editor pre {
          background-color: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .ql-editor a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .ql-editor img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 8px;
        }
        
        .ql-editor strong {
          font-weight: bold;
        }
        
        .ql-editor em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
