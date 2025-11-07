import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ isOpen, toggleSidebar, user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toggleSidebar();
    navigate("/");
  };

  const menuItems = [
    { label: "🏠 Home", path: "/" },
    { label: "🎬 Movies", path: "/movies" },
    { label: "📝 Add Review", path: "/add-review" },
    { label: "ℹ️ About", path: "/about" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            label={item.label}
            path={item.path}
            active={location.pathname === item.path}
            onClick={toggleSidebar}
          />
        ))}
      </ul>

      <div className="sidebar-bottom">
        {user ? (
          <button className="btn-logout" onClick={handleLogout}>
            🔓 Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="btn-login" onClick={toggleSidebar}>
              🔐 Login
            </Link>
            <Link to="/register" className="btn-login" onClick={toggleSidebar}>
              ✍️ Register
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}

// Sidebar item component
function SidebarItem({ label, path, active, onClick }) {
  return (
    <li>
      <Link
        to={path}
        onClick={onClick}
        className={`sidebar-link ${active ? "active" : ""}`}
      >
        {label}
      </Link>
    </li>
  );
}

export default Sidebar;
