import React from 'react';
import '../styles/blog-content.css';

const BlogContent = ({ content, className = "" }) => {
  return (
    <div 
      className={`blog-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogContent;
