import { useEffect, useState, useRef } from "react";
import api from "../api/axios"; // ✅ CHANGED
import "../assets/styles/adminTheme.css";
import "../assets/styles/adminEnrollments.css";
import AdminSidebar from "../components/AdminSidebar";

const AdminEnrollments = () => {
  const [stats, setStats] = useState({ total: 0, freeCount: 0, paidCount: 0 });
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    fetchStats();
    fetchEnrollments("");

    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const fetchStats = async () => {
    const res = await api.get("/api/admin/enrollments/stats"); // ✅ CHANGED
    setStats(res.data);
  };

  const fetchEnrollments = async (q = "") => {
    const res = await api.get(`/api/admin/enrollments?search=${q}`); // ✅ CHANGED
    setRows(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enrollment?")) return;

    await api.delete(`/api/admin/enrollments/${id}`); // ✅ CHANGED
    fetchEnrollments(search);
    fetchStats();
    setOpenMenuId(null);
  };

  const pct = (part, total) =>
    total ? ((part / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="ad-scope">
      <div className="ad-shell">
        <AdminSidebar />

        <main className="ad-main">
          <div className="ad-pageTop">
            <div>
              <h1 className="ad-title">Enrollments</h1>
              <p className="ad-subtitle">Track all course enrollments</p>
            </div>
          </div>

          <div className="enr-cards">
            <div className="ad-card ad-cardPad enr-card">
              <span className="enr-label">Total Enrollments</span>
              <h3 className="enr-value">{stats.total}</h3>
            </div>

            <div className="ad-card ad-cardPad enr-card">
              <span className="enr-label">Free Enrollments</span>
              <h3 className="enr-value">{stats.freeCount}</h3>
              <small className="enr-small">
                {pct(stats.freeCount, stats.total)}% of total
              </small>
            </div>

            <div className="ad-card ad-cardPad enr-card">
              <span className="enr-label">Paid Enrollments</span>
              <h3 className="enr-value">{stats.paidCount}</h3>
              <small className="enr-small">
                {pct(stats.paidCount, stats.total)}% of total
              </small>
            </div>
          </div>

          <div className="ad-card ad-cardPad enr-toolbar">
            <input
              className="enr-search"
              placeholder="Search by user name, email, or course..."
              value={search}
              onChange={(e) => {
                const v = e.target.value;
                setSearch(v);
                fetchEnrollments(v);
              }}
            />
          </div>

          <div className="ad-card ad-cardPad ad-tableWrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Enrolled</th>
                  <th style={{ width: 90 }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No enrollments found
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.student}</td>
                      <td>{r.email}</td>
                      <td>{r.course_name}</td>
                      <td>{r.enrolled_at?.slice(0, 10)}</td>

                      <td className="actions-cell">
                        <button
                          className="dots-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === r.id ? null : r.id
                            );
                          }}
                        >
                          ⋮
                        </button>

                        {openMenuId === r.id && (
                          <div className="actions-menu" ref={menuRef}>
                            <button
                              className="danger"
                              onClick={() => handleDelete(r.id)}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminEnrollments;