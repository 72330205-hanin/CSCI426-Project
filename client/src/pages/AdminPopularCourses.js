import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import "../assets/styles/adminPopularCourses.css";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const API = "http://localhost:5000";
const MAX_POPULAR = 6;

const imgUrl = (thumb) =>
  thumb ? `${API}/uploads/${thumb}` : "/images/course-placeholder.jpg";

const AdminPopularCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [stats, setStats] = useState({
    popularCount: 0,
    allCoursesCount: 0,
    popularCategoriesCount: 0,
    maxOrder: 0,
  });

  const [courseId, setCourseId] = useState("");
  const [order, setOrder] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [coursesRes, popularRes, statsRes] = await Promise.all([
        axios.get(`${API}/api/admin/courses`),
        axios.get(`${API}/api/admin/popular-courses`),
        axios.get(`${API}/api/admin/popular-courses/stats`),
      ]);

      setAllCourses(coursesRes.data || []);
      setPopularCourses(popularRes.data || []);
      setStats(
        statsRes.data || {
          popularCount: 0,
          allCoursesCount: 0,
          popularCategoriesCount: 0,
          maxOrder: 0,
        }
      );
    } catch (e) {
      console.error(e);
      alert("Failed to load Popular Courses data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (!openMenuId) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setOpenMenuId(null);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpenMenuId(null);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenuId]);

  const addPopular = async () => {
    if (!courseId) return alert("Select a course first");

    if (popularCourses.length >= MAX_POPULAR) {
      return alert(`You cannot add more than ${MAX_POPULAR} popular courses`);
    }

    const safeOrder = Number(order);
    if (!Number.isFinite(safeOrder) || safeOrder < 1) {
      return alert("Order must be >= 1");
    }

    try {
      await axios.post(`${API}/api/admin/popular-courses`, {
        course_id: Number(courseId),
        display_order: safeOrder,
      });
      setCourseId("");
      setOrder(1);
      await loadAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add");
    }
  };

  const updateOrder = async (popularId, newOrder) => {
    const n = Number(newOrder);
    if (!Number.isFinite(n) || n < 1) return alert("Order must be >= 1");

    try {
      await axios.put(`${API}/api/admin/popular-courses/${popularId}`, {
        display_order: n,
      });
      await loadAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update order");
    }
  };

  const removePopular = async (popularId) => {
    if (!window.confirm("Remove this course from Popular?")) return;
    try {
      await axios.delete(`${API}/api/admin/popular-courses/${popularId}`);
      setOpenMenuId(null);
      await loadAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to remove");
    }
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return popularCourses;

    return popularCourses.filter((p) => {
      const hay = `${p.title} ${p.category} ${p.instructor} ${p.display_order}`.toLowerCase();
      return hay.includes(s);
    });
  }, [q, popularCourses]);

  const canAddMore = popularCourses.length < MAX_POPULAR;

  return (
    <div className="ad-shell ap-font">
      <AdminSidebar />

      <main className="ad-main">
        <div className="ap-topbar">
          <div>
            <h1 className="ap-title">Popular Courses</h1>
            <p className="ap-subtitle">
              Manage which courses appear on the Home page “Popular Courses” section.
              <span style={{ marginLeft: 8, fontWeight: 700 }}>
                ({popularCourses.length}/{MAX_POPULAR})
              </span>
            </p>
          </div>
        </div>

        <section className="ap-statsGrid">
          <div className="ap-statCard">
            <div className="ap-statTitle">Popular Courses</div>
            <div className="ap-statValue">{stats.popularCount}</div>
          </div>

          <div className="ap-statCard">
            <div className="ap-statTitle">All Courses</div>
            <div className="ap-statValue">{stats.allCoursesCount}</div>
          </div>

          <div className="ap-statCard">
            <div className="ap-statTitle">Max Order</div>
            <div className="ap-statValue">{stats.maxOrder}</div>
          </div>
        </section>

        <div className="ap-addRow">
          <div className="ap-addBar">
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              <option value="">-- Select course --</option>
              {allCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              title="Display order"
            />

            <button className="ap-addBtn" onClick={addPopular} disabled={!canAddMore}>
              Add
            </button>
          </div>
        </div>

        <div className="ap-card">
          <div className="ap-searchRow">
            <div className="ap-searchBox">
              <SearchIcon className="ap-searchIcon" fontSize="small" />
              <input
                className="ap-searchInput"
                placeholder="Search by title, category, instructor, order..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          <div className="ap-tableWrap">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Instructor</th>
                  <th>Rating</th>
                  <th style={{ width: 120 }}>Order</th>
                  <th style={{ width: 90, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="ap-empty">
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="ap-empty">
                      No popular courses yet.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.popular_id}>
                      <td>
                        <div className="ap-courseCell">
                          <img
                            className="ap-thumb"
                            src={imgUrl(p.thumbnail_url)}
                            alt={p.title}
                            onError={(e) => {
                              e.currentTarget.src = "/images/course-placeholder.jpg";
                            }}
                          />
                          <div className="ap-courseMeta">
                            <div className="ap-courseTitle">{p.title}</div>
                            <div className="ap-courseSub">
                              ⭐ {p.rating} • {p.lessons_count} lessons • {p.duration_minutes} min
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>{p.category}</td>
                      <td>{p.instructor}</td>
                      <td>{p.rating}</td>

                      <td>
                        <input
                          className="ap-orderInput"
                          type="number"
                          min={1}
                          defaultValue={p.display_order}
                          onBlur={(e) => updateOrder(p.popular_id, e.target.value)}
                        />
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <div
                          className="ap-actions"
                          ref={openMenuId === p.popular_id ? menuRef : null}
                        >
                          <button
                            className="ap-kebabBtn"
                            title="Actions"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId((cur) =>
                                cur === p.popular_id ? null : p.popular_id
                              );
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </button>

                          {openMenuId === p.popular_id && (
                            <div className="ap-menu" onClick={(e) => e.stopPropagation()}>
                              <button
                                className="ap-menuItem ap-danger"
                                onClick={() => removePopular(p.popular_id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="ap-footNote">
            Tip: Change “Order” to control which course appears first on the Home page.
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPopularCourses;
