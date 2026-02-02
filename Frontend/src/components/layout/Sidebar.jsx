import { NavLink } from 'react-router-dom';
import { NAV_ITEMS, APP_NAME } from '../../utils/constants';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">{APP_NAME}</h1>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {NAV_ITEMS.map((item) => (
            <li key={item.path} className="sidebar-menu-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <span className="sidebar-icon">{getIcon(item.icon)}</span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/login" className="sidebar-link sidebar-logout">
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};

// Simple icon mapping function
const getIcon = (iconName) => {
  const icons = {
    dashboard: '📊',
    people: '👥',
    description: '📋',
    work: '💼',
    calendar: '📅',
  };
  return icons[iconName] || '📁';
};

export default Sidebar;
