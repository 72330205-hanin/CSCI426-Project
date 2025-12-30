import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../assets/styles/adminUsers.css";
import AdminSidebar from "../components/AdminSidebar";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";

/* ✅ API BASE (LOCAL OR ONLINE) */
const API =
  process.env.REACT_APP_API_URL ||
  "https://csci426-project.onrender.com";

/* helpers */
const roleLabel = (role) => {
  const r = String(role || "user").toLowerCase();
  if (r === "admin") return "Admin";
  if (r === "instructor") return "Instructor";
  return "Student";
};

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toISOString().slice(0, 10);
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [role, setRole] = useState("user");

  /* ✅ FETCH USERS */
  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(`${API}/api/admin/users`)
      .then((res) => setUsers(res.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ✅ SEARCH */
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) => {
      return (
        String(u.name).toLowerCase().includes(s) ||
        String(u.email).toLowerCase().includes(s) ||
        roleLabel(u.role).toLowerCase().includes(s)
      );
    });
  }, [q, users]);

  /* ✅ OPEN EDIT */
  const openEdit = (u) => {
    setEditingUser(u);
    setRole(u.role || "user");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setRole("user");
  };

  /* ✅ UPDATE ROLE (BACKEND MATCHES THIS EXACTLY) */
  const submit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await axios.put(`${API}/api/admin/users/${editingUser.id}`, {
        role,
      });
      closeModal();
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  /* ✅ DELETE USER */
  const removeUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API}/api/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="ad-shell">
      <AdminSidebar />

      <main className="ad-main">
        <div className="au-topbar">
          <div>
            <h1 className="au-title">Users</h1>
            <p className="au-subtitle">Manage all users in your system</p>
          </div>
        </div>

        <div className="au-card">
          <div className="au-searchRow">
            <div className="au-searchBox">
              <SearchIcon className="au-searchIcon" fontSize="small" />
              <input
                className="au-searchInput"
                placeholder="Search users..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          <div className="au-tableWrap">
            {loading ? (
              <div className="admin-loading">Loading users...</div>
            ) : (
              <table className="au-table">
                <thead>
                  <tr>
                    <th className="au-th">Name</th>
                    <th className="au-th">Email</th>
                    <th className="au-th">Role</th>
                    <th className="au-th">Status</th>
                    <th className="au-th">Joined</th>
                    <th className="au-th au-thRight">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="au-tr">
                      <td className="au-td">{u.name}</td>
                      <td className="au-td">{u.email}</td>
                      <td className="au-td">{roleLabel(u.role)}</td>
                      <td className="au-td">
                        <span className="au-status active">active</span>
                      </td>
                      <td className="au-td">
                        {formatDate(u.created_at)}
                      </td>

                      <td className="au-td au-tdRight">
                        <div className="au-actions">
                          <button
                            className="au-moreBtn"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === u.id ? null : u.id
                              )
                            }
                          >
                            <MoreVertIcon fontSize="small" />
                          </button>

                          {openMenuId === u.id && (
                            <div
                              className="au-menu"
                              onMouseLeave={() => setOpenMenuId(null)}
                            >
                              <button
                                className="au-menuItem"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  openEdit(u);
                                }}
                              >
                                <EditOutlinedIcon fontSize="small" />
                                Edit Role
                              </button>

                              <button
                                className="au-menuItem danger"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  removeUser(u.id);
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
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="au-empty">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ✅ EDIT MODAL */}
        {modalOpen && (
          <div className="au-modalOverlay" onClick={closeModal}>
            <div
              className="au-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="au-modalHeader">
                <div className="au-modalTitle">Edit Role</div>
                <button
                  className="au-closeBtn"
                  onClick={closeModal}
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>

              <form className="au-form" onSubmit={submit}>
                <label className="au-label">Role</label>
                <select
                  className="au-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>

                <div className="au-formActions">
                  <button
                    type="button"
                    className="au-btnGhost"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="au-btnPrimary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUsers;