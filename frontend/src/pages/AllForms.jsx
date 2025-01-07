import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListForms = () => {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      const token = localStorage.getItem("adminToken");
      try {
        const response = await axios.get("http://localhost:8000/api/v1/admin/forms/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setForms(response.data.data || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch forms");
      }
    };

    fetchForms();
  }, []);

  const deleteForm = async (formId) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`http://localhost:8000/api/v1/admin/forms/${formId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForms(forms.filter((form) => form._id !== formId));
      alert("Form deleted successfully.");
    } catch (error) {
      alert("Failed to delete form.");
    }
  };

  const handleEdit = (formId) => {
    navigate(`/view-form/${formId}`);
  };

  const handleCopyLink = (formId) => {
    const baseUrl = window.location.origin; // Gets the current website's base URL
    const formUrl = `${baseUrl}/form/${formId}`;
    navigator.clipboard.writeText(formUrl).then(() => {
      alert("Form link copied to clipboard!");
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">All Forms</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div
            key={form._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{form.title}</h2>
            <p className="text-gray-600 mb-6">{form.description || "No description available"}</p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => handleEdit(form._id)}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => deleteForm(form._id)}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => handleCopyLink(form._id)}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListForms;
