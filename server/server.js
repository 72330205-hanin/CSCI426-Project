const express = require("express");
const cors = require("cors");
const db = require("./db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

app.use("/uploads", express.static(uploadsDir));

// Register
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err) => {
    if (err) return res.status(400).json({ message: "Email already exists" });
    res.json({ message: "Registration successful" });
  });
});

//Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err || result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: result[0],
    });
  });
});

// GET ALL USERS
app.get("/users", (req, res) => {
  db.query("SELECT id, name, email FROM users", (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});

// CONTACT (PUBLIC) 
app.post("/api/contact", (req, res) => {
  const { first_name, last_name, email, subject, message } = req.body;

  if (!first_name || !last_name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const status = "new";
  const priority = "medium";

  const sql = `
    INSERT INTO contact (first_name, last_name, email, subject, message, status, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [first_name, last_name, email, subject, message, status, priority],
    (err) => {
      if (err) {
        console.error("CONTACT INSERT ERROR:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Message sent successfully" });
    }
  );
});

app.get("/contact", (req, res) => {
  const sql = `
    SELECT id, first_name, last_name, email, subject, message
    FROM contact
    ORDER BY id DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});

// FEEDBACK
app.post("/api/feedback", (req, res) => {
  const { course_name, rating, feedback_message } = req.body;

  if (!course_name || !rating || !feedback_message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    INSERT INTO feedback (course_name, rating, feedback_message)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [course_name, rating, feedback_message], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Feedback submitted successfully" });
  });
});

app.get("/feedback", (req, res) => {
  const sql = `SELECT id, course_name, rating, feedback_message FROM feedback ORDER BY id DESC`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});

//ENROLLMENTS
app.post("/api/enroll", (req, res) => {
  const { user_id, course_id, course_type } = req.body;

  if (!user_id || !course_id || !course_type) {
    return res.status(400).json({ message: "Missing enrollment data" });
  }

  let enrollment_type = "free";
  if (course_type === "Paid Course" || course_type === "Advanced Masterclass") {
    enrollment_type = "paid";
  }

  db.query(
    "SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? LIMIT 1",
    [user_id, course_id],
    (checkErr, existing) => {
      if (checkErr) return res.status(500).json({ message: "Database error" });
      if (existing.length > 0)
        return res.status(409).json({ message: "Already enrolled" });

      db.query(
        `INSERT INTO enrollments (user_id, course_id, course_type, enrollment_type)
         VALUES (?, ?, ?, ?)`,
        [user_id, course_id, course_type, enrollment_type],
        (err) => {
          if (err) return res.status(500).json({ message: "Database error" });
          res.json({ message: "Enrolled successfully" });
        }
      );
    }
  );
});

app.get("/api/enrollments/:userId", (req, res) => {
  const sql = `
    SELECT
      e.id AS enrollment_id,
      e.course_id,
      e.course_type,
      e.enrolled_at,
      c.title,
      c.thumbnail_url
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    WHERE e.user_id = ?
    ORDER BY e.enrolled_at DESC
  `;

  db.query(sql, [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(rows);
  });
});

app.delete("/api/enroll/:id", (req, res) => {
  db.query("DELETE FROM enrollments WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Enrollment not found" });
    res.json({ message: "Enrollment cancelled" });
  });
});

// ADMIN STATS 
app.get("/api/admin/stats", (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS totalCourses FROM courses", (e1, r1) => {
    if (e1) return res.status(500).json({ message: "DB error" });
    stats.totalCourses = r1[0].totalCourses;

    db.query("SELECT COUNT(*) AS totalUsers FROM users", (e2, r2) => {
      if (e2) return res.status(500).json({ message: "DB error" });
      stats.totalUsers = r2[0].totalUsers;

      db.query("SELECT COUNT(*) AS totalEnrollments FROM enrollments", (e3, r3) => {
        if (e3) return res.status(500).json({ message: "DB error" });
        stats.totalEnrollments = r3[0].totalEnrollments;

        db.query(
          "SELECT course_type, COUNT(*) AS count FROM enrollments GROUP BY course_type",
          (e4, r4) => {
            if (e4) return res.status(500).json({ message: "DB error" });
            stats.breakdown = r4;

            db.query(
              "SELECT AVG(rating) AS avgRating, COUNT(*) AS totalFeedback FROM feedback",
              (e5, r5) => {
                if (e5) return res.status(500).json({ message: "DB error" });
                stats.avgRating = Number(r5[0].avgRating || 0).toFixed(1);
                stats.totalFeedback = r5[0].totalFeedback;

                db.query(
                  `SELECT u.name, c.title AS course_name, e.course_type, e.enrolled_at
                   FROM enrollments e
                   JOIN users u ON u.id = e.user_id
                   JOIN courses c ON c.id = e.course_id
                   ORDER BY e.enrolled_at DESC
                   LIMIT 5`,
                  (e6, r6) => {
                    if (e6) return res.status(500).json({ message: "DB error" });
                    stats.recentActivity = r6;

                    db.query("SELECT COUNT(*) AS totalContacts FROM contact", (e7, r7) => {
                      if (e7) return res.status(500).json({ message: "DB error" });
                      stats.totalContacts = r7[0].totalContacts;

                      res.json(stats);
                    });
                  }
                );
              }
            );
          }
        );
      });
    });
  });
});

//ADMIN COURSES
app.get("/api/admin/courses", (req, res) => {
  const sql = `
    SELECT
      id,
      title,
      category,
      instructor,
      rating,
      lessons_count,
      duration_minutes,
      section,
      thumbnail_url AS thumbnail,
      created_at
    FROM courses
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("ADMIN COURSES GET ERROR:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(result);
  });
});

app.post("/api/admin/courses", upload.single("thumbnail"), (req, res) => {
  const { title, category, instructor, rating, lessons_count, duration_minutes, section } = req.body;

  if (!req.file) return res.status(400).json({ message: "Image required" });

  const safeSection = section && section.trim() !== "" ? section : "free";

  const sql = `
    INSERT INTO courses
    (title, category, instructor, rating, lessons_count, duration_minutes, section, thumbnail_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, category, instructor, rating, lessons_count, duration_minutes, safeSection, req.file.filename],
    (err, result) => {
      if (err) {
        console.error("ADD COURSE ERROR:", err);
        return res.status(500).json({ message: "DB error" });
      }

      res.json({
        message: "Course added successfully",
        course: {
          id: result.insertId,
          title,
          category,
          instructor,
          rating,
          lessons_count,
          duration_minutes,
          section: safeSection,
          thumbnail: req.file.filename,
        },
      });
    }
  );
});

app.put("/api/admin/courses/:id", upload.single("thumbnail"), (req, res) => {
  const { id } = req.params;
  const { title, category, instructor, rating, lessons_count, duration_minutes, section } = req.body;

  const safeSection = section && section.trim() !== "" ? section : "free";
  const newThumb = req.file ? req.file.filename : null;

  const sql = `
    UPDATE courses SET
      title = ?,
      category = ?,
      instructor = ?,
      rating = ?,
      lessons_count = ?,
      duration_minutes = ?,
      section = ?,
      thumbnail_url = COALESCE(?, thumbnail_url)
    WHERE id = ?
  `;

  db.query(
    sql,
    [title, category, instructor, rating, lessons_count, duration_minutes, safeSection, newThumb, id],
    (err) => {
      if (err) {
        console.error("EDIT COURSE ERROR:", err);
        return res.status(500).json({ message: "Update failed" });
      }
      res.json({ message: "Course updated" });
    }
  );
});

app.delete("/api/admin/courses/:id", (req, res) => {
  db.query("DELETE FROM courses WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ message: "Course deleted" });
  });
});

//FRONTEND COURSES 
app.get("/api/courses", (req, res) => {
  const sql = `
    SELECT
      id,
      title,
      category,
      instructor,
      rating,
      lessons_count,
      duration_minutes,
      section,
      thumbnail_url AS thumbnail,
      created_at
    FROM courses
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("FRONTEND COURSES ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(result);
  });
});

//ADMIN USERS APIs 
app.get("/api/admin/users", (req, res) => {
  const sql = `SELECT id, name, email, role, created_at FROM users ORDER BY id DESC`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(rows);
  });
});

app.put("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) return res.status(400).json({ message: "Role is required" });

  const sql = `UPDATE users SET role = ? WHERE id = ?`;
  db.query(sql, [role, id], (err) => {
    if (err) return res.status(500).json({ message: "Update failed" });
    res.json({ message: "Role updated" });
  });
});

app.delete("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  db.query(`DELETE FROM users WHERE id = ?`, [id], (err) => {
    if (err) return res.status(500).json({ message: "Delete failed" });
    res.json({ message: "User deleted" });
  });
});

//ADMIN CONTACT APIs
app.get("/api/admin/contact/stats", (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS newCount,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS inProgressCount,
      SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolvedCount
    FROM contact
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(rows[0]);
  });
});

app.get("/api/admin/contact", (req, res) => {
  const sql = `
    SELECT id, first_name, last_name, email, subject, message,
           status, priority, created_at
    FROM contact
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(rows);
  });
});

app.put("/api/admin/contact/:id", (req, res) => {
  const { id } = req.params;
  const { status, priority } = req.body;

  const allowedStatus = ["new", "in_progress", "resolved"];
  const allowedPriority = ["low", "medium", "high"];

  if (!allowedStatus.includes(status)) return res.status(400).json({ message: "Invalid status" });
  if (!allowedPriority.includes(priority)) return res.status(400).json({ message: "Invalid priority" });

  db.query("UPDATE contact SET status = ?, priority = ? WHERE id = ?", [status, priority, id], (err) => {
    if (err) return res.status(500).json({ message: "Update failed" });
    res.json({ message: "Updated" });
  });
});

app.delete("/api/admin/contact/:id", (req, res) => {
  db.query("DELETE FROM contact WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Delete failed" });
    res.json({ message: "Deleted" });
  });
});

// ADMIN ENROLLMENTS 
app.get("/api/admin/enrollments", (req, res) => {
  const search = req.query.search || "";
  const q = `%${search}%`;

  const sql = `
    SELECT
      e.id,
      u.name AS student,
      u.email,
      c.title AS course_name,
      e.course_type AS type,
      e.enrolled_at
    FROM enrollments e
    JOIN users u ON u.id = e.user_id
    JOIN courses c ON c.id = e.course_id
    WHERE
      u.name LIKE ? OR
      u.email LIKE ? OR
      c.title LIKE ?
    ORDER BY e.enrolled_at DESC
  `;

  db.query(sql, [q, q, q], (err, rows) => {
    if (err) {
      console.error("ADMIN ENROLLMENTS ERROR:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(rows);
  });
});

app.get("/api/admin/enrollments/stats", (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN enrollment_type = 'free' THEN 1 ELSE 0 END) AS freeCount,
      SUM(CASE WHEN enrollment_type = 'paid' THEN 1 ELSE 0 END) AS paidCount
    FROM enrollments
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(rows[0]);
  });
});

app.delete("/api/admin/enrollments/:id", (req, res) => {
  db.query("DELETE FROM enrollments WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Delete failed" });
    res.json({ message: "Enrollment deleted" });
  });
});

// ADMIN FEEDBACK APIs 
app.get("/api/admin/feedback", (req, res) => {
  const sql = `
    SELECT
      f.id,
      f.user_id,
      COALESCE(u.name, f.user_name, 'Anonymous') AS user_name,
      f.course_name,
      f.rating,
      f.feedback_message,
      f.status,
      f.created_at
    FROM feedback f
    LEFT JOIN users u ON u.id = f.user_id
    ORDER BY f.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(rows);
  });
});

app.put("/api/admin/feedback/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["pending", "approved"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

  db.query("UPDATE feedback SET status = ? WHERE id = ?", [status, id], (err) => {
    if (err) return res.status(500).json({ message: "Update failed" });
    res.json({ message: "Updated" });
  });
});

app.delete("/api/admin/feedback/:id", (req, res) => {
  db.query("DELETE FROM feedback WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Delete failed" });
    res.json({ message: "Deleted" });
  });
});

app.get("/api/admin/feedback/stats", (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS totalFeedback,
      ROUND(AVG(rating), 1) AS avgRating,
      SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS pendingCount,
      SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) AS approvedCount,
      COUNT(DISTINCT user_id) AS usersWhoFeedback,
      COUNT(DISTINCT user_name) AS usersByName
    FROM feedback
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });

    const r = rows[0] || {};
    const usersCount =
      Number(r.usersWhoFeedback || 0) > 0
        ? Number(r.usersWhoFeedback || 0)
        : Number(r.usersByName || 0);

    res.json({
      totalFeedback: Number(r.totalFeedback || 0),
      avgRating: Number(r.avgRating || 0),
      pendingCount: Number(r.pendingCount || 0),
      approvedCount: Number(r.approvedCount || 0),
      usersCount,
      usersWhoFeedback: Number(r.usersWhoFeedback || 0),
    });
  });
});

// PUBLIC (Home page)
app.get("/api/popular-courses", (req, res) => {
  const sql = `
    SELECT
      c.id,
      c.title,
      c.category,
      c.instructor,
      c.rating,
      c.lessons_count,
      c.duration_minutes,
      c.thumbnail_url
    FROM popular_courses pc
    JOIN courses c ON c.id = pc.course_id
    ORDER BY pc.display_order ASC, pc.created_at DESC
    LIMIT 6
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(rows);
  });
});

// ADMIN list
app.get("/api/admin/popular-courses", (req, res) => {
  const sql = `
    SELECT
      pc.id AS popular_id,
      pc.course_id,
      pc.display_order,
      c.title,
      c.category,
      c.instructor,
      c.rating,
      c.lessons_count,
      c.duration_minutes,
      c.thumbnail_url
    FROM popular_courses pc
    JOIN courses c ON c.id = pc.course_id
    ORDER BY pc.display_order ASC, pc.created_at DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(rows);
  });
});

// ADMIN add course to popular
app.post("/api/admin/popular-courses", (req, res) => {
  const { course_id, display_order } = req.body;
  if (!course_id) return res.status(400).json({ message: "course_id required" });

  const order = Number(display_order || 1);

  db.query(
    "INSERT INTO popular_courses (course_id, display_order) VALUES (?, ?)",
    [course_id, order],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Already added" });
        }
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Added" });
    }
  );
});

// ADMIN update order (edit)
app.put("/api/admin/popular-courses/:popularId", (req, res) => {
  const { display_order } = req.body;
  const order = Number(display_order);
  if (!Number.isFinite(order)) {
    return res.status(400).json({ message: "display_order must be a number" });
  }

  db.query(
    "UPDATE popular_courses SET display_order = ? WHERE id = ?",
    [order, req.params.popularId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Updated" });
    }
  );
});

// ADMIN delete
app.delete("/api/admin/popular-courses/:popularId", (req, res) => {
  db.query(
    "DELETE FROM popular_courses WHERE id = ?",
    [req.params.popularId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Deleted" });
    }
  );
});

// POPULAR COURSES STATS (ADMIN)
app.get("/api/admin/popular-courses/stats", (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM popular_courses) AS popularCount,
      (SELECT COUNT(*) FROM courses) AS allCoursesCount,
      (SELECT COUNT(DISTINCT c.category)
         FROM popular_courses pc
         JOIN courses c ON c.id = pc.course_id
      ) AS popularCategoriesCount,
      (SELECT COALESCE(MAX(display_order), 0) FROM popular_courses) AS maxOrder
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(rows[0] || { popularCount: 0, allCoursesCount: 0, popularCategoriesCount: 0, maxOrder: 0 });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});