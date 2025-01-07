import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditForm = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const { data } = await axios.get(`/api/forms/${id}`);
        setTitle(data.payload.title);
        setFields(data.payload.fields);
      } catch (error) {
        console.error('Error fetching form:', error);
      }
    };
    fetchForm();
  }, [id]);

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/forms/${id}`, { title, fields });
      navigate('/');
    } catch (error) {
      console.error('Error updating form:', error);
    }
  };

  return (
    <div>
      <h1>Edit Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {fields.map((field, index) => (
          <div key={index}>
            <input
              type="text"
              value={field.label}
              onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
            />
            <select
              value={field.type}
              onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
            </select>
            <label>
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
              />
              Required
            </label>
          </div>
        ))}
        <button type="submit">Update Form</button>
      </form>
    </div>
  );
};

export default EditForm;