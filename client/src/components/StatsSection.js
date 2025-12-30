import React from "react";

const StatsSection = () => {
  return (
    <section className="stats-wrapper">
      <div className="container stats-row">
        <div className="stat-item">
          <div className="stat-value">1000+</div>
          <div className="stat-label">Active Students</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">500+</div>
          <div className="stat-label">Expert Courses</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">130+</div>
          <div className="stat-label">Qualified Instructors</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">123</div>
          <div className="stat-label">Available Subjects</div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;