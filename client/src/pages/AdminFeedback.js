import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios"; // ✅ CHANGED
import "../assets/styles/adminFeedback.css";
import AdminSidebar from "../components/AdminSidebar";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";

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
        api.get("/api/admin/feedback"), // ✅ CHANGED
        api.get("/api/admin/feedback/stats"), // ✅ CHANGED
      ]);
      setRows(rowsRes.data || []);
      setStats(statsRes.data || stats);
    } catch {
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
      await api.put(`/api/admin/feedback/${id}`, { status }); // ✅ CHANGED
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );

      const statsRes = await api.get("/api/admin/feedback/stats"); // ✅ CHANGED
      setStats(statsRes.data || stats);
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  const removeFeedback = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await api.delete(`/api/admin/feedback/${id}`); // ✅ CHANGED
      setRows((prev) => prev.filter((r) => r.id !== id));

      const statsRes = await api.get("/api/admin/feedback/stats"); // ✅ CHANGED
      setStats(statsRes.data || stats);
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="ad-shell">
      <AdminSidebar />
      {/* UI remains unchanged */}
    </div>
  );
};

export default AdminFeedback;