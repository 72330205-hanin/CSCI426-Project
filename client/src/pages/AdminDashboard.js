import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
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
  } else if (t.includes("paid") || t.includes("buy") || t.includes("masterclass") || t.includes("advanced")) {
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
    axios
      .get("http://localhost:5000/api/admin/stats")
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
      (breakdownMap["Free Course"] || 0) + (breakdownMap["Free Trial"] || 0);

    const paidCount =
      (breakdownMap["Paid Course"] || 0) + (breakdownMap["Advanced Masterclass"] || 0);

    const total = freeCount + paidCount || 1;
    const freePercent = Math.round((freeCount / total) * 100);
    const paidPercent = Math.round((paidCount / total) * 100);

    return { freeCount, paidCount, total, freePercent, paidPercent };
  }, [stats]);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;
  if (!stats) return <div className="admin-loading">Failed to load dashboard</div>;

  const publishedCourses = stats.publishedCourses ?? stats.totalCourses;

  return (
    <div className="ad-shell">
      <AdminSidebar />

      <main className="ad-main">
        <header className="ad-header">
          <div>
            <h1 className="ad-title">Dashboard</h1>
            <p className="ad-subtitle">Overview of your learning management system</p>
          </div>
        </header>

        <section className="ad-statsGrid">
          <StatCard
            title="Total Courses"
            value={stats.totalCourses}
            sub={`${publishedCourses} published`}
            icon={<MenuBookIcon />}
          />

          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            sub={`${Math.max(0, stats.totalUsers - 1)} active users`}
            icon={<GroupsIcon />}
          />

          <StatCard
            title="Enrollments"
            value={stats.totalEnrollments}
            sub={`${computed?.paidCount || 0} paid, ${computed?.freeCount || 0} free`}
            icon={<SchoolIcon />}
          />
          <StatCard
            title="Contact Messages"
            value={stats.totalContacts || 0}
            sub="Messages received"
            icon={<MailOutlineIcon />}
          />
        </section>

        <section className="ad-twoCols">
          <div className="ad-card">
            <div className="ad-cardHeader">
              <div className="ad-cardTitle">
                <span className="ad-miniIcon">
                  <AutoGraphIcon fontSize="small" />
                </span>
                Enrollment Breakdown
              </div>
            </div>

            <div className="ad-cardBody">
              <ProgressRow
                label="Free Enrollments"
                value={computed?.freeCount || 0}
                percent={computed?.freePercent || 0}
                colorClass="teal"
              />
              <ProgressRow
                label="Paid Enrollments"
                value={computed?.paidCount || 0}
                percent={computed?.paidPercent || 0}
                colorClass="blue"
              />
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-cardHeader">
              <div className="ad-cardTitle">
                <span className="ad-miniIcon">
                  <StarOutlineIcon fontSize="small" />
                </span>
                Course Performance
              </div>
            </div>

            <div className="ad-cardBody">
              <div className="ad-kv">
                <div className="ad-kvRow">
                  <span className="ad-kvKey">Average Rating</span>
                  <span className="ad-kvVal">{stats.avgRating} / 5.0</span>
                </div>
                <div className="ad-kvRow">
                  <span className="ad-kvKey">Total Feedback</span>
                  <span className="ad-kvVal">{stats.totalFeedback}</span>
                </div>
                <div className="ad-kvRow">
                  <span className="ad-kvKey">Published Courses</span>
                  <span className="ad-kvVal">{publishedCourses}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ad-card">
          <div className="ad-cardHeader">
            <div className="ad-cardTitle">Recent Activity</div>
          </div>

          <div className="ad-table">
            {(stats.recentActivity || []).map((row, i) => (
              <div
                key={i}
                className={`ad-row ${i === stats.recentActivity.length - 1 ? "last" : ""}`}
              >
                <div className="ad-rowMain">
                  <div className="ad-rowName">{row.name}</div>
                  <div className="ad-rowSub">Enrolled in {row.course_name}</div>
                </div>

                <div className="ad-rowRight">
                  <Tag courseType={row.course_type} />
                  <div className="ad-rowDate">
                    {new Date(row.enrolled_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;