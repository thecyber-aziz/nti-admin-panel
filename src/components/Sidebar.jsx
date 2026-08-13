import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  WalletCards,
  Banknote,
  FileBarChart,
  Settings,
  LogOut,
  X,
  Factory
} from "lucide-react";

import {
  NavLink,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Employees",
    path: "/employees",
    icon: Users
  },
  {
    name: "Attendance",
    path: "/attendance",
    icon: ClipboardCheck
  },
  {
    name: "Salary",
    path: "/salary",
    icon: WalletCards
  },
  {
    name: "Salary Advance",
    path: "/advance",
    icon: Banknote
  },

  {
    name: "Settings",
    path: "/settings",
    icon: Settings
  }
];

export default function Sidebar({
  open,
  onClose
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {open && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${
          open ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="company-brand">
            <div className="company-logo">
              {/* <Factory size={25} /> */}
              <img src="/nti.png" alt="New Taj Industries" />
            </div>

            <div>
              <h2>NEW TAJ</h2>
              <span>INDUSTRIES</span>
            </div>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive
                      ? "active"
                      : ""
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>

          <div className="sidebar-version">
            New Taj Industries
            <br />
            Admin v1.0
          </div>
        </div>
      </aside>
    </>
  );
}
