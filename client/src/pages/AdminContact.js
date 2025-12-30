import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../assets/styles/adminContact.css";
import AdminSidebar from "../components/AdminSidebar";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const API = "http://localhost:5000";

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toISOString().slice(0, 10);
};

const normStatus = (s) => {
  const v = String(s || "new").toLowerCase().trim();
  if (v === "in progress") return "in_progress";
  return v;
};

const normPriority = (p) => {
  const v = String(p || "medium").toLowerCase().trim();
  return v;
};

const AdminContact = () => {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    newCount: 0,
    inProgressCount: 0,
    resolvedCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rowsRes, statsRes] = await Promise.all([
        axios.get(`${API}/api/admin/contact`),
        axios.get(`${API}/api/admin/contact/stats`),
      ]);

      setRows(rowsRes.data || []);
      setStats(
        statsRes.data || {
          total: 0,
          newCount: 0,
          inProgressCount: 0,
          resolvedCount: 0,
        }
      );
    } catch (e) {
      setRows([]);
      setStats({
        total: 0,
        newCount: 0,
        inProgressCount: 0,
        resolvedCount: 0,
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
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;

    return rows.filter((r) => {
      const name = `${r.first_name || ""} ${r.last_name || ""}`.toLowerCase();
      const email = String(r.email || "").toLowerCase();
      const subject = String(r.subject || "").toLowerCase();
      const msg = String(r.message || "").toLowerCase();
      return (
        name.includes(s) ||
        email.includes(s) ||
        subject.includes(s) ||
        msg.includes(s)
      );
    });
  }, [q, rows]);

  const refreshStats = async () => {
    const statsRes = await axios.get(`${API}/api/admin/contact/stats`);
    setStats(statsRes.data || stats);
  };

  const updateRow = async (id, next) => {
    try {
      const payload = {
        status: normStatus(next.status),
        priority: normPriority(next.priority),
      };

      await axios.put(`${API}/api/admin/contact/${id}`, payload);

      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: payload.status, priority: payload.priority }
            : r
        )
      );

      await refreshStats();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  const removeContact = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await axios.delete(`${API}/api/admin/contact/${id}`);
      setRows((prev) => prev.filter((r) => r.id !== id));
      await refreshStats();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="ad-shell">
      <AdminSidebar />

      <main className="ad-main">
        <div className="ac-topbar">
          <div>
            <h1 className="ac-title">Contact Messages</h1>
            <p className="ac-subtitle">Manage contact form submissions</p>
          </div>
        </div>

        <section className="ac-statsGrid">
          <div className="ac-statCard">
            <div className="ac-statTitle">Total Messages</div>
            <div className="ac-statValue">{stats.total}</div>
          </div>

          <div className="ac-statCard">
            <div className="ac-statTitle">New</div>
            <div className="ac-statValue blue">{stats.newCount}</div>
          </div>

          <div className="ac-statCard">
            <div className="ac-statTitle">In Progress</div>
            <div className="ac-statValue orange">{stats.inProgressCount}</div>
          </div>

          <div className="ac-statCard">
            <div className="ac-statTitle">Resolved</div>
            <div className="ac-statValue green">{stats.resolvedCount}</div>
          </div>
        </section>

        <div className="ac-card">
          <div className="ac-searchRow">
            <div className="ac-searchBox">
              <SearchIcon className="ac-searchIcon" fontSize="small" />
              <input
                className="ac-searchInput"
                placeholder="Search by name, email, subject, or message..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          <div className="ac-tableWrap">
            {loading ? (
              <div className="admin-loading">Loading messages...</div>
            ) : (
              <table className="ac-table">
                <thead>
                  <tr>
                    <th className="ac-th col-name">Name</th>
                    <th className="ac-th col-email">Email</th>
                    <th className="ac-th col-subject">Subject</th>
                    <th className="ac-th col-priority">Priority</th>
                    <th className="ac-th col-status">Status</th>
                    <th className="ac-th col-date">Date</th>
                    <th className="ac-th ac-thRight col-actions">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((r) => {
                    const currentPriority = normPriority(r.priority);
                    const currentStatus = normStatus(r.status);

                    return (
                      <tr key={r.id} className="ac-tr">
                        <td className="ac-td col-name">
                          {r.first_name} {r.last_name}
                        </td>

                        <td className="ac-td col-email">{r.email}</td>

                        <td className="ac-td col-subject">
                          <span className="ac-subject">{r.subject}</span>
                        </td>

                        <td className="ac-td col-priority">
                          <select
                            className="ac-select"
                            value={currentPriority}
                            onChange={(e) =>
                              updateRow(r.id, {
                                priority: e.target.value,
                                status: currentStatus,
                              })
                            }
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </td>

                        <td className="ac-td col-status">
                          <select
                            className="ac-select"
                            value={currentStatus}
                            onChange={(e) =>
                              updateRow(r.id, {
                                status: e.target.value,
                                priority: currentPriority,
                              })
                            }
                          >
                            <option value="new">New</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>

                        <td className="ac-td col-date">
                          {formatDate(r.created_at)}
                        </td>

                        <td className="ac-td ac-tdRight col-actions">
                          <div
                            className="ac-actions"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="ac-moreBtn"
                              onClick={() =>
                                setOpenMenuId(openMenuId === r.id ? null : r.id)
                              }
                            >
                              <MoreVertIcon fontSize="small" />
                            </button>

                            {openMenuId === r.id && (
                              <div className="ac-menu">
                                <button
                                  className="ac-menuItem danger"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    removeContact(r.id);
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
                      <td className="ac-empty" colSpan={7}>
                        No messages found.
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

export default AdminContact;
