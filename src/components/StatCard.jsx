export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className = ""
}) {
  return (
    <div
      className={`stat-card ${className}`}
    >
      <div className="stat-card-top">
        <div className="stat-icon">
          {Icon && <Icon size={22} />}
        </div>

        {description && (
          <span className="stat-description">
            {description}
          </span>
        )}
      </div>

      <div className="stat-content">
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}