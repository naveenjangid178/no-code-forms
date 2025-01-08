import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ViewForm = () => {
  const { id } = useParams(); // Get form ID from URL params
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);


  useEffect(() => {
    const fetchResponses = async () => {
      const token = localStorage.getItem("adminToken");
      try {
        const responsesResponse = await axios.get(
          `http://localhost:8000/api/v1/admin/forms/${id}/responses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched responses:", responsesResponse.data); // Debug response
        setResponses(responsesResponse.data.data || [""]); // Adjust based on actual API response structure
      } catch (error) {
        console.error("Error fetching responses:", error);
        setError(error.response?.data?.message || "Failed to fetch responses");
      }
    };
  
    fetchResponses();
  }, [id]);
  
  
  

  // Fetch the form details
  useEffect(() => {
    const fetchForm = async () => {
      const token = localStorage.getItem("adminToken");
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/admin/forms/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setForm(response.data.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch form details");
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  // Handle form field change
  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...form.fields];
    updatedFields[index][key] = value;
    setForm({ ...form, fields: updatedFields });
  };

  // Add a new field
  const addField = () => {
    const newField = { label: "", type: "text", options: [] }; // Default field structure
    setForm({ ...form, fields: [...form.fields, newField] });
  };

  // Remove a field
  const removeField = (index) => {
    const updatedFields = [...form.fields];
    updatedFields.splice(index, 1);
    setForm({ ...form, fields: updatedFields });
  };

  // Add options for dropdown, radio, or checkbox fields
  const addOption = (fieldIndex) => {
    const updatedFields = [...form.fields];
    if (!updatedFields[fieldIndex].options) {
      updatedFields[fieldIndex].options = [];
    }
    updatedFields[fieldIndex].options.push("");
    setForm({ ...form, fields: updatedFields });
  };

  // Handle option value change
  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...form.fields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setForm({ ...form, fields: updatedFields });
  };

  // Remove an option
  const removeOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...form.fields];
    updatedFields[fieldIndex].options.splice(optionIndex, 1);
    setForm({ ...form, fields: updatedFields });
  };

  // Submit the updated form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    try {
      await axios.put(
        `http://localhost:8000/api/v1/admin/forms/${id}`,
        { title: form.title, fields: form.fields },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Form updated successfully.");
      navigate("/"); // Redirect to the list forms page
    } catch (error) {
      alert("Failed to update form.");
    }
  };

  // Duplicate the form
  const duplicateForm = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/admin/forms/${id}/duplicate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Form duplicated successfully.");
      navigate(`/all-forms`); // Navigate to the duplicated form
    } catch (error) {
      alert(error.response?.data?.message || "Failed to duplicate form.");
    }
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Edit Form</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        <div>
          <label htmlFor="formTitle" className="block text-sm font-medium text-gray-700">
            Form Title
          </label>
          <input
            id="formTitle"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {form.fields.map((field, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg shadow-inner space-y-4"
          >
            <div>
              <label
                htmlFor={`fieldLabel-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Field Label
              </label>
              <input
                id={`fieldLabel-${index}`}
                type="text"
                value={field.label}
                onChange={(e) =>
                  handleFieldChange(index, "label", e.target.value)
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor={`fieldType-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Field Type
              </label>
              <select
                id={`fieldType-${index}`}
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
            {(field.type === "dropdown" ||
              field.type === "radio" ||
              field.type === "checkbox") && (
              <div>
                <label
                  htmlFor={`options-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Options
                </label>
                {field.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, optIndex, e.target.value)
                      }
                      className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index, optIndex)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(index)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Add Option
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => removeField(index)}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
              Remove Field
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addField}
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-blue-600"
        >
          Add Field
        </button>
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={duplicateForm}
          className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Duplicate Form
        </button>
      </form>

      <div className="mt-10">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">Form Responses</h2>
  {responses.length > 0 ? (
    <div className="space-y-4">
      {responses.map((response, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
          {Object.entries(response).map(([key, value]) => (
            <p key={key} className="text-gray-800">
              <strong>{key}:</strong> {value}
            </p>
          ))}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-500">No responses submitted yet.</p>
  )}
</div>
    </div>
  );
};

export default ViewForm;