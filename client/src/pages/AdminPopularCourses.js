import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/axios"; // ✅ CHANGED
import AdminSidebar from "../components/AdminSidebar";
import "../assets/styles/adminPopularCourses.css";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const MAX_POPULAR = 6;

const imgUrl = (thumb) =>
  thumb ? `/uploads/${thumb}` : "/images/course-placeholder.jpg"; // ✅ CHANGED

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
        api.get("/api/admin/courses"), // ✅ CHANGED
        api.get("/api/admin/popular-courses"), // ✅ CHANGED
        api.get("/api/admin/popular-courses/stats"), // ✅ CHANGED
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

    try {
      await api.post("/api/admin/popular-courses", { // ✅ CHANGED
        course_id: Number(courseId),
        display_order: Number(order),
      });
      setCourseId("");
      setOrder(1);
      await loadAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add");
    }
  };

  const updateOrder = async (popularId, newOrder) => {
    try {
      await api.put(`/api/admin/popular-courses/${popularId}`, { // ✅ CHANGED
        display_order: Number(newOrder),
      });
      await loadAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update order");
    }
  };

  const removePopular = async (popularId) => {
    if (!window.confirm("Remove this course from Popular?")) return;
    try {
      await api.delete(`/api/admin/popular-courses/${popularId}`); // ✅ CHANGED
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

  return (
    <div className="ad-shell ap-font">
      <AdminSidebar />
      {/* UI unchanged */}
    </div>
  );
};

export default AdminPopularCourses;