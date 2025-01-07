import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateForm = () => {
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontColor, setFontColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const navigate = useNavigate();

  const addField = () => {
    setFields([
      ...fields,
      { label: "", type: "text", required: false, options: [] },
    ]);
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedFields = [...fields];
    updatedFields[index].options[optionIndex] = value;
    setFields(updatedFields);
  };

  const addOption = (index) => {
    const updatedFields = [...fields];
    if (!updatedFields[index].options) {
      updatedFields[index].options = [];
    }
    updatedFields[index].options.push("");
    setFields(updatedFields);
  };

  const deleteField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const deleteOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].options.splice(optionIndex, 1);
    setFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create payload
    const payload = {
      title,
      description: "",
      fields,
      style: { backgroundColor, fontColor, fontFamily },
      isPublished: true,
    };

    try {
      // Make POST request to API
      await axios.post("http://localhost:8000/api/v1/admin/forms/", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      // Redirect to the form listing page after successful creation
      navigate("/all-forms");
    } catch (error) {
      console.error("Error creating form:", error);
      alert("Failed to create form. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div
        className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg"
        style={{
          backgroundColor: backgroundColor,
          color: fontColor,
          fontFamily: fontFamily,
        }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Create New Form</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Form Title
            </label>
            <input
              type="text"
              placeholder="Enter form title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Styling Options */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Form Styling</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Background Color
                </label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="mt-2 w-full h-10 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Font Color
                </label>
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="mt-2 w-full h-10 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm px-4 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={addField}
            className="w-full sm:w-auto bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 transition"
          >
            Add Field
          </button>

          {/* Fields */}
          {fields.map((field, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-inner space-y-4 relative"
            >
              <button
                type="button"
                onClick={() => deleteField(index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 focus:outline-none"
                title="Delete Field"
              >
                ✕
              </button>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Field Label
                </label>
                <input
                  type="text"
                  placeholder="Enter field label"
                  value={field.label}
                  onChange={(e) =>
                    handleFieldChange(index, "label", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Field Type
                </label>
                <select
                  value={field.type}
                  onChange={(e) =>
                    handleFieldChange(index, "type", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="number">Number</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="radio">Radio</option>
                  <option value="date">Date</option>
                  <option value="email">Email</option>
                </select>
              </div>
              {(field.type === "dropdown" || field.type === "radio") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Options
                  </label>
                  {field.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mt-1">
                      <input
                        type="text"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, optionIndex, e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => deleteOption(index, optionIndex)}
                        className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                        title="Delete Option"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(index)}
                    className="mt-2 bg-indigo-600 text-white font-semibold py-1 px-3 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Option
                  </button>
                </div>
              )}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) =>
                    handleFieldChange(index, "required", e.target.checked)
                  }
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Required
                </label>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full sm:w-auto bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Create Form
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateForm;