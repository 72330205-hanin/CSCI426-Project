import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/adminModal.css";

const EditCourseModal = ({ open, onClose, course, onUpdated }) => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    instructor: "",
    rating: "",
    lessons_count: "",
    duration_minutes: "",
    thumbnail_url: "",
  });

  useEffect(() => {
    if (course) {
      setForm(course);
    }
  }, [course]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/courses/${course.id}`,
        form
      );
      onUpdated();
      onClose();
    } catch {
      alert("Failed to update course");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Edit Course</h3>

        <div className="modal-grid">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
          <input name="instructor" value={form.instructor} onChange={handleChange} placeholder="Instructor" />
          <input name="rating" value={form.rating} onChange={handleChange} placeholder="Rating" />
          <input name="lessons_count" value={form.lessons_count} onChange={handleChange} placeholder="Lessons" />
          <input name="duration_minutes" value={form.duration_minutes} onChange={handleChange} placeholder="Duration (min)" />
          <input name="thumbnail_url" value={form.thumbnail_url} onChange={handleChange} placeholder="Thumbnail URL" />
        </div>

        <div className="modal-actions">
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleUpdate}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditCourseModal;