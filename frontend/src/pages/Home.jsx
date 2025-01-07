import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const { data } = await axios.get("/api/forms");
        setForms(data.payload.forms);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
    fetchForms();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/forms/${id}`);
      setForms(forms.filter((form) => form._id !== id));
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        No-Code Forms Dashboard
      </h1>
      <Link
        to="/create-form"
        className="mb-6 inline-block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create New Form
      </Link>
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
        <ul className="space-y-4">
          {forms.length > 0 ? (
            forms.map((form) => (
              <li
                key={form._id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-inner"
              >
                <Link
                  to={`/form/${form._id}`}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  {form.title}
                </Link>
                <button
                  onClick={() => handleDelete(form._id)}
                  className="text-red-600 hover:text-red-800 font-semibold focus:outline-none"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-600 text-center">
              No forms found. Click "Create New Form" to add one.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;