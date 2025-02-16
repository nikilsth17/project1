// TemplateList.js
import React from 'react';

const TemplateList = ({ templates, onEdit, onDelete }) => {
  return (
    <ul>
      {templates.map(template => (
        <li key={template.id}>
          <h3>{template.name}</h3>
          <p>{template.content}</p>
          <button onClick={() => onEdit(template)}>Edit</button>
          <button onClick={() => onDelete(template.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TemplateList;
