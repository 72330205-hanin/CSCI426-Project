import React from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({
  image,
  category,
  title,
  instructor,
  rating,
  students,
  duration,
  level,
}) => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate("/courses");
  };

  const safeLevel = (level || "Beginner").toString();
  const levelClass = safeLevel.toLowerCase();

  return (
    <article className="course-card">
      <div className="course-card-image-wrapper">
        <img src={image} alt={title} className="course-card-image" />
        <span className="course-card-tag-top">{category}</span>
      </div>

      <div className="course-card-body">
        <h3 className="course-card-title">{title}</h3>
        <p className="course-card-instructor">{instructor}</p>

        <div className="course-card-meta">
          <span>⭐ {rating}</span>
          <span>👥 {students}</span>
          <span>🕒 {duration}</span>
        </div>

        <div className="course-card-footer">
          <span className={`level-badge level-${levelClass}`}>
            {safeLevel}
          </span>
          <button className="course-link" onClick={handleLearnMore}>
            Learn More
          </button>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;