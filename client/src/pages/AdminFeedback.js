import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../assets/styles/adminFeedback.css";
import AdminSidebar from "../components/AdminSidebar";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";

const API = "http://localhost:5000";

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toISOString().slice(0, 10);
};

const Stars = ({ value }) => {
  const v = Number(value || 0);
  const full = Math.max(0, Math.min(5, Math.round(v)));

  return (
    <div className="af-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`af-star ${i < full ? "on" : ""}`}>
          ★
        </span>
      ))}
      <span className="af-ratingNum">{Number(value || 0)}</span>
    </div>
  );
};

const AdminFeedback = () => {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({
    totalFeedback: 0,
    avgRating: 0,
    pendingCount: 0,
    approvedCount: 0,
    usersCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rowsRes, statsRes] = await Promise.all([
        axios.get(`${API}/api/admin/feedback`),
        axios.get(`${API}/api/admin/feedback/stats`),
      ]);
      setRows(rowsRes.data || []);
      setStats(statsRes.data || stats);
    } catch (e) {
      setRows([]);
      setStats({
        totalFeedback: 0,
        avgRating: 0,
        pendingCount: 0,
        approvedCount: 0,
        usersCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const onDocClick = () => setOpenMenuId(null);
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;

    return rows.filter((r) => {
      const user = String(r.user_name || "").toLowerCase();
      const course = String(r.course_name || "").toLowerCase();
      const msg = String(r.feedback_message || "").toLowerCase();
      const st = String(r.status || "").toLowerCase();
      return (
        user.includes(s) ||
        course.includes(s) ||
        msg.includes(s) ||
        st.includes(s)
      );
    });
  }, [q, rows]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/api/admin/feedback/${id}`, { status });
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

      const statsRes = await axios.get(`${API}/api/admin/feedback/stats`);
      setStats(statsRes.data || stats);
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  const removeFeedback = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await axios.delete(`${API}/api/admin/feedback/${id}`);
      setRows((prev) => prev.filter((r) => r.id !== id));

      const statsRes = await axios.get(`${API}/api/admin/feedback/stats`);
      setStats(statsRes.data || stats);
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="ad-shell">
      <AdminSidebar />

      <main className="ad-main">
        <div className="af-topbar">
          <div>
            <h1 className="af-title">Feedback</h1>
            <p className="af-subtitle">Manage course feedback and reviews</p>
          </div>
        </div>

        <section className="af-statsGrid">
          <div className="af-statCard">
            <div className="af-statTitle">Total Feedback</div>
            <div className="af-statValue">{stats.totalFeedback}</div>
          </div>

          <div className="af-statCard">
            <div className="af-statTitle">Average Rating</div>
            <div className="af-statValue">
              {Number(stats.avgRating || 0).toFixed(1)}
            </div>
            <div className="af-statStars">
              <Stars value={stats.avgRating} />
            </div>
          </div>

          <div className="af-statCard">
            <div className="af-statTitle">Pending Review</div>
            <div className="af-statValue orange">{stats.pendingCount}</div>
          </div>

          <div className="af-statCard">
            <div className="af-statTitle">Approved</div>
            <div className="af-statValue green">{stats.approvedCount}</div>
          </div>
        </section>

        <div className="af-usersLine">
          Users who left feedback: <b>{stats.usersCount}</b>
        </div>

        <div className="af-card">
          <div className="af-searchRow">
            <div className="af-searchBox">
              <SearchIcon className="af-searchIcon" fontSize="small" />
              <input
                className="af-searchInput"
                placeholder="Search by user, course, or comment..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          <div className="af-tableWrap">
            {loading ? (
              <div className="admin-loading">Loading feedback...</div>
            ) : (
              <table className="af-table">
                <thead>
                  <tr>
                    <th className="af-th col-user">User</th>
                    <th className="af-th col-course">Course</th>
                    <th className="af-th col-rating">Rating</th>
                    <th className="af-th col-comment">Comment</th>
                    <th className="af-th col-status">Status</th>
                    <th className="af-th col-date">Date</th>
                    <th className="af-th af-thRight col-actions">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((r) => {
                    const st = String(r.status || "pending").toLowerCase();

                    return (
                      <tr key={r.id} className="af-tr">
                        <td className="af-td col-user">
                          {r.user_name || "Anonymous"}
                        </td>
                        <td className="af-td col-course">{r.course_name}</td>

                        <td className="af-td col-rating">
                          <Stars value={r.rating} />
                        </td>

                        <td className="af-td col-comment">
                          <div className="af-msg">{r.feedback_message}</div>
                        </td>

                        <td className="af-td col-status">
                          <span className={`af-pill ${st}`}>
                            {st === "approved" ? "approved" : "pending"}
                          </span>
                        </td>

                        <td className="af-td col-date">
                          {formatDate(r.created_at)}
                        </td>

                        <td className="af-td af-tdRight col-actions">
                          <div
                            className="af-actions"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="af-moreBtn"
                              onClick={() =>
                                setOpenMenuId(openMenuId === r.id ? null : r.id)
                              }
                            >
                              <MoreVertIcon fontSize="small" />
                            </button>

                            {openMenuId === r.id && (
                              <div className="af-menu">
                                {st !== "approved" && (
                                  <button
                                    className="af-menuItem"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      updateStatus(r.id, "approved");
                                    }}
                                  >
                                    <CheckCircleOutlineIcon fontSize="small" />
                                    Approve
                                  </button>
                                )}

                                {st !== "pending" && (
                                  <button
                                    className="af-menuItem"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      updateStatus(r.id, "pending");
                                    }}
                                  >
                                    <PendingOutlinedIcon fontSize="small" />
                                    Mark Pending
                                  </button>
                                )}

                                <button
                                  className="af-menuItem danger"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    removeFeedback(r.id);
                                  }}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filtered.length === 0 && (
                    <tr>
                      <td className="af-empty" colSpan={7}>
                        No feedback found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminFeedback;
