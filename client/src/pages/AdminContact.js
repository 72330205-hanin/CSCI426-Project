import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios"; 
import "../assets/styles/adminContact.css";
import AdminSidebar from "../components/AdminSidebar";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

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
        api.get("/api/admin/contact"),
        api.get("/api/admin/contact/stats"),
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
    const statsRes = await api.get("/api/admin/contact/stats");
    setStats(statsRes.data || stats);
  };

  const updateRow = async (id, next) => {
    try {
      const payload = {
        status: normStatus(next.status),
        priority: normPriority(next.priority),
      };

      await api.put(`/api/admin/contact/${id}`, payload);

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
      await api.delete(`/api/admin/contact/${id}`);
      setRows((prev) => prev.filter((r) => r.id !== id));
      await refreshStats();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="ad-shell">
      <AdminSidebar />
      {/* UI unchanged */}
    </div>
  );
};

export default AdminContact;