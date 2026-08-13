import { Menu, Bell, UserCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/employees": "Employees",
  "/attendance": "Attendance",
  "/salary": "Salary Management",
  "/advance": "Salary Advance",
  "/reports": "Reports",
  "/settings": "Settings"
};

export default function Navbar({ onMenu }) {
  const location = useLocation();

  const title =
    pageTitles[location.pathname] || "New Taj Industries";

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          className="mobile-menu-btn"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">
            New Taj Industries Admin Panel
          </p>
        </div>
      </div>

      <div className="navbar-right">
        <button className="icon-btn" title="Notifications">
          <Bell size={20} />
          <span className="notification-dot" />
        </button>

        <div className="admin-profile">
          <div className="admin-avatar">
            <UserCircle size={30} />
          </div>

          <div className="admin-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}