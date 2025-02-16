// TemplateForm.js
import React, { useState, useEffect } from 'react';

const TemplateForm = ({ onSubmit, editingTemplate, setEditingTemplate }) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editingTemplate) {
      setName(editingTemplate.name);
      setContent(editingTemplate.content);
    }
  }, [editingTemplate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, content });
    setName('');
    setContent('');
    setEditingTemplate(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Template Name"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Template Content"
        required
      />
      <button type="submit">
        {editingTemplate ? 'Update Template' : 'Add Template'}
      </button>
    </form>
  );
};

export default TemplateForm;
