import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../assets/styles/adminCourses.css";
import placeholder from "../assets/images/web.jpg";
import AdminSidebar from "../components/AdminSidebar";

const API = "http://localhost:5000";

const emptyCourse = {
  title: "",
  category: "",
  instructor: "",
  rating: "",
  lessons_count: "",
  duration_minutes: "",
  section: "free",
  thumbnail: null,
};

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState(emptyCourse);

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchCourses();

    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const fetchCourses = () => {
    setLoading(true);
    axios
      .get(`${API}/api/admin/courses`)
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setForm(emptyCourse);
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title || "",
      category: course.category || "",
      instructor: course.instructor || "",
      rating: course.rating || "",
      lessons_count: course.lessons_count || "",
      duration_minutes: course.duration_minutes || "",
      section: course.section || "free",
      thumbnail: null,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const data = new FormData();

    Object.keys(form).forEach((k) => {
      if (form[k] !== null && form[k] !== "") {
        data.append(k, form[k]);
      }
    });

    if (editingCourse) {
      await axios.put(
        `${API}/api/admin/courses/${editingCourse.id}`,
        data
      );
    } else {
      await axios.post(`${API}/api/admin/courses`, data);
    }

    setShowModal(false);
    fetchCourses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    await axios.delete(`${API}/api/admin/courses/${id}`);
    fetchCourses();
  };

  return (
    <div className="ad-shell">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-header">
          <h1>Courses</h1>
          <button className="add-course-btn" onClick={openAddModal}>
            + Add Course
          </button>
        </div>

        <div className="admin-table">
          {loading ? (
            <div className="admin-loading">Loading...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Instructor</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Lessons</th>
                  <th>Duration</th>
                  <th>Section</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan="9" align="center">
                      No courses found
                    </td>
                  </tr>
                ) : (
                  courses.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <img
                          src={`${API}/uploads/${c.thumbnail}`}
                          className="course-thumb"
                          onError={(e) =>
                            (e.currentTarget.src = placeholder)
                          }
                          alt=""
                        />
                      </td>
                      <td>{c.title}</td>
                      <td>{c.instructor}</td>
                      <td>{c.category}</td>
                      <td>{c.rating}</td>
                      <td>{c.lessons_count}</td>
                      <td>{c.duration_minutes} min</td>
                      <td>{c.section}</td>

                      <td className="actions-cell">
                        <button
                          className="dots-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === c.id ? null : c.id);
                          }}
                        >
                          ⋮
                        </button>

                        {openMenuId === c.id && (
                          <div className="actions-menu" ref={menuRef}>
                            <button onClick={() => openEditModal(c)}>
                              Edit
                            </button>
                            <button
                              className="danger"
                              onClick={() => handleDelete(c.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>{editingCourse ? "Edit Course" : "Add Course"}</h3>

              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <input
                placeholder="Instructor"
                value={form.instructor}
                onChange={(e) =>
                  setForm({ ...form, instructor: e.target.value })
                }
              />

              <input
                placeholder="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />

              <input
                placeholder="Rating"
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: e.target.value })
                }
              />

              <input
                placeholder="Lessons Count"
                value={form.lessons_count}
                onChange={(e) =>
                  setForm({ ...form, lessons_count: e.target.value })
                }
              />

              <input
                placeholder="Duration (minutes)"
                value={form.duration_minutes}
                onChange={(e) =>
                  setForm({ ...form, duration_minutes: e.target.value })
                }
              />

              <select
                value={form.section}
                onChange={(e) =>
                  setForm({ ...form, section: e.target.value })
                }
              >
                <option value="free">Free</option>
                <option value="trial">Trial</option>
                <option value="paid">Paid</option>
                <option value="advanced">Advanced</option>
              </select>

              <input
                type="file"
                onChange={(e) =>
                  setForm({ ...form, thumbnail: e.target.files[0] })
                }
              />

              <div className="modal-actions">
                <button
                  className="cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="save" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCourses;
