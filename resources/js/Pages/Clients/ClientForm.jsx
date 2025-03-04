import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { router } from "@inertiajs/react";

export default function ClientForm({ isEditing = false, id = null }) {
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isEditing && id) {
      fetchClient(id);
    }
  }, [isEditing, id]);

  const fetchClient = async (clientId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/clients/${clientId}`);
      setFormData(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to load client data. Please try again.");
      console.error("Error fetching client:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear field-specific error when user makes a change
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      if (isEditing) {
        await axios.put(`/api/v1/clients/${id}`, formData);
      } else {
        await axios.post("/api/v1/clients", formData);
      }
      
      // Redirect to clients list after successful submission
      router.visit("/clients");
    } catch (err) {
      console.error("Error submitting form:", err);
      
      if (err.response && err.response.data && err.response.data.errors) {
        // Handle validation errors
        setFieldErrors(err.response.data.errors);
      } else {
        // Handle general error
        setError(
          isEditing 
            ? "Failed to update client. Please try again." 
            : "Failed to create client. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="spinner"></div>
        <p className="mt-2">Loading client data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditing ? "Edit Client" : "Add New Client"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className={`shadow appearance-none border ${
              fieldErrors.name ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Client Name"
            required
          />
          {fieldErrors.name && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.name[0]}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className={`shadow appearance-none border ${
              fieldErrors.email ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="client@example.com"
            required
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.email[0]}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone
          </label>
          <input
            className={`shadow appearance-none border ${
              fieldErrors.phone ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          {fieldErrors.phone && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.phone[0]}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
            Company
          </label>
          <input
            className={`shadow appearance-none border ${
              fieldErrors.company ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="company"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company Name"
          />
          {fieldErrors.company && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.company[0]}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Saving..." : isEditing ? "Update Client" : "Create Client"}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => navigate("/clients")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}