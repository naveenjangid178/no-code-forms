import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SubmitForm = () => {
  const { formId } = useParams(); // Extract formId from URL
  const [form, setForm] = useState(null); // Form data
  const [response, setResponse] = useState({}); // User responses
  const [error, setError] = useState(null); // Error state
  const [success, setSuccess] = useState(null); // Success state

  useEffect(() => {
    if (!formId) {
      setError("Invalid form ID. Please check the URL.");
      return;
    }

    const fetchForm = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/forms/response/${formId}/view`
        );
        setForm(res.data.data); // Ensure the API response structure is correct
        setError(null); // Clear any previous error
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch form. Please try again later."
        );
      }
    };

    fetchForm();
  }, [formId]);

  const handleChange = (fieldId, value) => {
    setResponse((prevResponse) => ({
      ...prevResponse,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formId) {
      setError("Invalid form ID. Unable to submit.");
      return;
    }

    // Transforming the response into the required payload structure
    const payload = {
      formId,
      responses: Object.entries(response).reduce((acc, [fieldId, value]) => {
        const field = form.fields.find((f) => f._id === fieldId);
        if (field) acc[field.label] = value; // Use the field label as the key
        return acc;
      }, {}),
    };

    try {
      console.log("Submitting payload:", payload); // Debugging log
      const res = await axios.post(
        `http://localhost:8000/api/v1/forms/response/${formId}`,
        payload
      );
      console.log("Submission response:", res.data); // Debugging log
      setSuccess("Response submitted successfully!");
      setError(null);
      setResponse({}); // Clear the form after submission
    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message); // Debugging log
      setError(
        err.response?.data?.message || "Failed to submit response. Please try again."
      );
      setSuccess(null);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-6">{error}</div>;
  }

  if (!form) {
    return <div className="text-center mt-6">Loading form...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {form.title}
      </h1>
      <p className="text-gray-600 text-center mb-6">{form.description}</p>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        {form.fields.map((field) => (
          <div key={field._id} className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {field.label}
            </label>
            {field.type === "text" && (
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                value={response[field._id] || ""}
                onChange={(e) => handleChange(field._id, e.target.value)}
              />
            )}
            {field.type === "textarea" && (
              <textarea
                className="w-full border border-gray-300 rounded-md p-2"
                value={response[field._id] || ""}
                onChange={(e) => handleChange(field._id, e.target.value)}
              ></textarea>
            )}
            {field.type === "checkbox" && (
              <div>
                {field.options.map((option, index) => (
                  <label key={index} className="block">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={response[field._id]?.[option] || false}
                      onChange={(e) =>
                        handleChange(field._id, {
                          ...response[field._id],
                          [option]: e.target.checked,
                        })
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            {field.type === "radio" && (
              <div>
                {field.options.map((option, index) => (
                  <label key={index} className="block">
                    <input
                      type="radio"
                      name={field._id}
                      value={option}
                      checked={response[field._id] === option}
                      className="mr-2"
                      onChange={(e) => handleChange(field._id, e.target.value)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-purple-700"
        >
          Submit
        </button>

        {success && <p className="text-green-500 text-center mt-6">{success}</p>}
        {error && <p className="text-red-500 text-center mt-6">{error}</p>}
      </form>
    </div>
  );
};

export default SubmitForm;
