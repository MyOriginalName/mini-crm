import React, { useState, useEffect } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";

export default function TaskForm({ isEditing = false, id = null }) {
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    due_date: "",
    client_id: ""
  });
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    fetchClients();
    if (isEditing && id) {
      fetchTask(id);
    }
  }, [isEditing, id]);

  const fetchClients = async () => {
    try {
      const response = await axios.get("/api/v1/clients");
      setClients(response.data.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const fetchTask = async (taskId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/tasks/${taskId}`);
      setFormData(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to load task data. Please try again.");
      console.error("Error fetching task:", err);
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
        await axios.put(`/api/v1/tasks/${id}`, formData);
      } else {
        await axios.post("/api/v1/tasks", formData);
      }
      router.visit("/tasks");
    } catch (err) {
      console.error("Error submitting form:", err);
      
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setError(
          isEditing 
            ? "Failed to update task. Please try again." 
            : "Failed to create task. Please try again."
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
        <p className="mt-2">Loading task data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditing ? "Edit Task" : "Add New Task"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            className={`shadow appearance-none border ${
              fieldErrors.title ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Task Title"
            required
          />
          {fieldErrors.title && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.title[0]}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className={`shadow appearance-none border ${
              fieldErrors.description ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Task Description"
            rows="4"
          />
          {fieldErrors.description && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.description[0]}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            Status
          </label>
          <select
            className={`shadow appearance-none border ${
              fieldErrors.status ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {fieldErrors.status && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.status[0]}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due_date">
            Due Date
          </label>
          <input
            className={`shadow appearance-none border ${
              fieldErrors.due_date ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="due_date"
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            required
          />
          {fieldErrors.due_date && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.due_date[0]}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="client_id">
            Client
          </label>
          <select
            className={`shadow appearance-none border ${
              fieldErrors.client_id ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="client_id"
            name="client_id"
            value={formData.client_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {fieldErrors.client_id && (
            <p className="text-red-500 text-xs italic mt-1">{fieldErrors.client_id[0]}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Saving..." : isEditing ? "Update Task" : "Create Task"}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => navigate("/tasks")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}