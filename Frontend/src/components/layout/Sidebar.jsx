import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../../utils/constants';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Icon components based on the design
  const icons = {
    dashboard: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.33333 8.33333L10 2.5L16.6667 8.33333V15.8333C16.6667 16.2754 16.4911 16.6993 16.1785 17.0118C15.866 17.3244 15.442 17.5 15 17.5H5C4.55797 17.5 4.13405 17.3244 3.82149 17.0118C3.50893 16.6993 3.33333 16.2754 3.33333 15.8333V8.33333Z" fill="#FFFFFF"/>
      </svg>
    ),
    clients: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 10C11.3807 10 12.5 8.88071 12.5 7.5C12.5 6.11929 11.3807 5 10 5C8.61929 5 7.5 6.11929 7.5 7.5C7.5 8.88071 8.61929 10 10 10ZM10 11.25C7.91667 11.25 4.375 12.2958 4.375 14.375V15.625H15.625V14.375C15.625 12.2958 12.0833 11.25 10 11.25Z" fill="#FFFFFF"/>
      </svg>
    ),
    quotes: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 7.5H3.75V11.25H7.5V7.5ZM16.25 7.5H12.5V11.25H16.25V7.5Z" fill="#FFFFFF"/>
      </svg>
    ),
    jobs: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.8333 5H13.3333V3.33333C13.3333 2.41667 12.5833 1.66667 11.6667 1.66667H8.33333C7.41667 1.66667 6.66667 2.41667 6.66667 3.33333V5H4.16667C3.25 5 2.5 5.75 2.5 6.66667V15.8333C2.5 16.75 3.25 17.5 4.16667 17.5H15.8333C16.75 17.5 17.5 16.75 17.5 15.8333V6.66667C17.5 5.75 16.75 5 15.8333 5ZM8.33333 3.33333H11.6667V5H8.33333V3.33333Z" fill="#FFFFFF"/>
      </svg>
    ),
    schedule: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.8333 3.33333H15V1.66667H13.3333V3.33333H6.66667V1.66667H5V3.33333H4.16667C3.24167 3.33333 2.50833 4.08333 2.50833 5L2.5 16.6667C2.5 17.5833 3.24167 18.3333 4.16667 18.3333H15.8333C16.75 18.3333 17.5 17.5833 17.5 16.6667V5C17.5 4.08333 16.75 3.33333 15.8333 3.33333ZM15.8333 16.6667H4.16667V8.33333H15.8333V16.6667Z" fill="#FFFFFF"/>
      </svg>
    ),
    invoices: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.1667 2.5H5.83333C4.91667 2.5 4.16667 3.25 4.16667 4.16667V15.8333C4.16667 16.75 4.91667 17.5 5.83333 17.5H14.1667C15.0833 17.5 15.8333 16.75 15.8333 15.8333V4.16667C15.8333 3.25 15.0833 2.5 14.1667 2.5ZM12.5 10.8333H7.5V9.16667H12.5V10.8333ZM12.5 8.33333H7.5V6.66667H12.5V8.33333Z" fill="#FFFFFF"/>
      </svg>
    ),
    timesheets: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="7.5" fill="#FFFFFF"/>
        <path d="M10 5.83333V10L13.3333 11.6667" stroke="#183B59" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    booking: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.8333 3.33333H15V1.66667H13.3333V3.33333H6.66667V1.66667H5V3.33333H4.16667C3.24167 3.33333 2.50833 4.08333 2.50833 5L2.5 16.6667C2.5 17.5833 3.24167 18.3333 4.16667 18.3333H15.8333C16.75 18.3333 17.5 17.5833 17.5 16.6667V5C17.5 4.08333 16.75 3.33333 15.8333 3.33333ZM15.8333 16.6667H4.16667V8.33333H15.8333V16.6667Z" fill="#FFFFFF"/>
      </svg>
    ),
    reports: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="13.3333" y="5" width="1.66667" height="10" fill="#FFFFFF"/>
        <rect x="9.16667" y="7.5" width="1.66667" height="7.5" fill="#FFFFFF"/>
        <rect x="5" y="12.5" width="1.66667" height="2.5" fill="#FFFFFF"/>
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.95 10.78C15.9833 10.5267 16 10.2667 16 10C16 9.73333 15.9833 9.47333 15.9417 9.22L17.7333 7.85333C17.8917 7.73333 17.9333 7.5 17.8417 7.32L16.1417 4.36C16.0417 4.16667 15.8167 4.1 15.6333 4.16667L13.5167 5C13.0917 4.68333 12.6333 4.42333 12.1333 4.23333L11.8 1.98333C11.7667 1.78333 11.5917 1.63333 11.3833 1.63333H7.98333C7.775 1.63333 7.60833 1.78333 7.575 1.98333L7.24167 4.23333C6.74167 4.42333 6.275 4.69167 5.85833 5L3.75 4.16667C3.56667 4.09167 3.34167 4.16667 3.24167 4.36L1.55 7.32C1.45 7.5 1.5 7.73333 1.66667 7.85333L3.45833 9.22C3.41667 9.47333 3.38333 9.74167 3.38333 10C3.38333 10.2583 3.4 10.5267 3.44167 10.78L1.65 12.1467C1.49167 12.2667 1.45 12.5 1.54167 12.68L3.24167 15.64C3.34167 15.8333 3.56667 15.9 3.75 15.8333L5.86667 15C6.29167 15.3167 6.75 15.5767 7.25 15.7667L7.58333 18.0167C7.60833 18.2167 7.775 18.3667 7.98333 18.3667H11.3833C11.5917 18.3667 11.7667 18.2167 11.7917 18.0167L12.125 15.7667C12.625 15.5767 13.0917 15.3167 13.5083 15L15.625 15.8333C15.8083 15.9083 16.0333 15.8333 16.1333 15.64L17.8333 12.68C17.9333 12.4867 17.8833 12.2667 17.725 12.1467L15.95 10.78ZM9.68333 12.8333C8.125 12.8333 6.85 11.5583 6.85 10C6.85 8.44167 8.125 7.16667 9.68333 7.16667C11.2417 7.16667 12.5167 8.44167 12.5167 10C12.5167 11.5583 11.2417 12.8333 9.68333 12.8333Z" fill="#FFFFFF"/>
      </svg>
    ),
  };

  const getIcon = (iconName) => icons[iconName] || icons.dashboard;

  return (
    <aside className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <h1 className="logo">TRAKJOBS</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="nav-menu">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="nav-item-content">
              <div className="nav-icon">
                {getIcon(item.icon)}
              </div>
              <span className="nav-text">{item.label}</span>
            </div>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
