import { useLocation } from 'react-router-dom';
import { NAV_ITEMS, APP_NAME } from '../../utils/constants';
import './Header.css';

const Header = () => {
  const location = useLocation();

  // Get current page title based on route
  const getCurrentPageTitle = () => {
    const currentNav = NAV_ITEMS.find((item) =>
      location.pathname.startsWith(item.path)
    );
    return currentNav?.label || 'Dashboard';
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="header-title">{getCurrentPageTitle()}</h2>
      </div>

      <div className="header-right">
        <button className="header-notification">
          <span className="notification-icon">🔔</span>
          <span className="notification-badge">3</span>
        </button>

        <div className="header-user">
          <div className="header-avatar">
            <span>JD</span>
          </div>
          <div className="header-user-info">
            <span className="header-user-name">John Doe</span>
            <span className="header-user-role">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
