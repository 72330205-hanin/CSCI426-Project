import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios"; // ✅ CHANGED
import "../assets/styles/adminDashboard.css";
import AdminSidebar from "../components/AdminSidebar";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

const StatCard = ({ title, value, sub, icon }) => {
  return (
    <div className="ad-statCard">
      <div className="ad-statLeft">
        <div className="ad-statTitle">{title}</div>
        <div className="ad-statValue">{value}</div>
        <div className="ad-statSub">{sub}</div>
      </div>
      <div className="ad-statIcon">{icon}</div>
    </div>
  );
};

const ProgressRow = ({ label, value, percent, colorClass }) => {
  return (
    <div className="ad-progressRow">
      <div className="ad-progressTop">
        <span className="ad-progressLabel">{label}</span>
        <span className="ad-progressValue">{value}</span>
      </div>
      <div className="ad-progressTrack">
        <div
          className={`ad-progressFill ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const Tag = ({ courseType }) => {
  if (!courseType) return null;

  const t = String(courseType).toLowerCase();
  let cls = "free";
  let label = "free";

  if (t.includes("trial")) {
    cls = "trial";
    label = "start trial";
  } else if (
    t.includes("paid") ||
    t.includes("buy") ||
    t.includes("masterclass") ||
    t.includes("advanced")
  ) {
    cls = "paid";
    label = "paid";
  } else if (t.includes("free")) {
    cls = "free";
    label = "free";
  } else {
    return null;
  }

  return <span className={`ad-tag ${cls}`}>{label}</span>;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/admin/stats") // ✅ CHANGED
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const computed = useMemo(() => {
    if (!stats) return null;

    const breakdownMap = {};
    (stats.breakdown || []).forEach((row) => {
      breakdownMap[row.course_type] = Number(row.count || 0);
    });

    const freeCount =
      (breakdownMap["Free Course"] || 0) +
      (breakdownMap["Free Trial"] || 0);

    const paidCount =
      (breakdownMap["Paid Course"] || 0) +
      (breakdownMap["Advanced Masterclass"] || 0);

    const total = freeCount + paidCount || 1;
    const freePercent = Math.round((freeCount / total) * 100);
    const paidPercent = Math.round((paidCount / total) * 100);

    return { freeCount, paidCount, total, freePercent, paidPercent };
  }, [stats]);

  if (loading)
    return <div className="admin-loading">Loading dashboard...</div>;
  if (!stats)
    return <div className="admin-loading">Failed to load dashboard</div>;

  const publishedCourses = stats.publishedCourses ?? stats.totalCourses;

  return (
    <div className="ad-shell">
      <AdminSidebar />
      {/* UI UNCHANGED */}
    </div>
  );
};

export default AdminDashboard;