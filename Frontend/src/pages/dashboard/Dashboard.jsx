import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  // Summary stats cards data
  const stats = [
    { label: 'Active Jobs', value: 12, color: 'green' },
    { label: 'Quotes to follow up', value: 3, color: 'orange' },
    { label: 'Unpaid invoices', value: 5, color: 'brown' },
    { label: 'New Booking Requests', value: 2, color: 'yellow' },
  ];

  // Today's schedule data
  const todaySchedule = [
    { id: 1, time: '9:00 AM', client: 'Sarah B.', service: 'Lawn Care' },
    { id: 2, time: '10:30 AM', client: 'Mike T.', service: 'Pool Cleaning' },
    { id: 3, time: '1:00 PM', client: 'David K.', service: 'Garden Maintenance' },
    { id: 4, time: '3:00 PM', client: 'Lisa M.', service: 'Tree Trimming' },
    { id: 5, time: '4:30 PM', client: 'John D.', service: 'Lawn Mowing' },
  ];

  // Quotes data
  const quotes = [
    { id: 1, amount: '$850', status: 'Pending Approval' },
    { id: 2, amount: '$850', status: 'Pending Approval' },
    { id: 3, amount: '$850', status: 'Pending Approval' },
    { id: 4, amount: '$850', status: 'Pending Approval' },
  ];

  // Invoices data
  const invoices = [
    { id: 1, number: 'Invoice #1234', amount: '$345.00' },
    { id: 2, number: 'Invoice #1235', amount: '$520.00' },
    { id: 3, number: 'Invoice #1236', amount: '$680.00' },
    { id: 4, number: 'Invoice #1237', amount: '$450.00' },
    { id: 5, number: 'Invoice #1238', amount: '$290.00' },
  ];

  // Team members data
  const teamMembers = [
    { id: 1, name: 'Chris', status: 'Clocked In', statusClass: 'clocked-in' },
    { id: 2, name: 'Sarah', status: 'On Route', statusClass: 'on-route' },
    { id: 3, name: 'Dave', status: 'Clock Out', statusClass: 'clock-out' },
  ];

  return (
    <div className="dashboard">
      {/* Stats Cards Row */}
      <section className="stats-row">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-info">
              <h3>{stat.label}</h3>
              <h2>{stat.value}</h2>
            </div>
            <div className={`stat-icon ${stat.color}`}>
              {getStatIcon(stat.color)}
            </div>
          </div>
        ))}
      </section>

      {/* Dashboard Grid - Map and Schedule */}
      <section className="dashboard-grid">
        <div className="map-section">
          <div className="map-placeholder">
            <span className="map-text">Map View</span>
          </div>
        </div>

        <div className="schedule-section">
          <div className="section-header">
            <h3 className="section-title">Today&apos;s Schedule</h3>
            <select className="select-dropdown">
              <option>Select</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="schedule-list">
            {todaySchedule.map((item) => (
              <div key={item.id} className="schedule-item">
                <span>{item.time} {item.client} - {item.service}</span>
                <span className="schedule-arrow">›</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Grid - Client Profile, Quotes, and Invoices */}
      <section className="bottom-grid">
        {/* Client Profile Card */}
        <div className="client-profile">
          <div className="client-profile-header"></div>
          <div className="client-avatar"></div>
          <div className="client-info">
            <h2 className="client-name">Jessica Sharma</h2>
            <p className="client-address">231 Oak St.</p>

            <div className="client-contact">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span>555-123-4567</span>
            </div>

            <div className="client-contact">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>jessica@gmail.com</span>
            </div>

            <button className="button-primary">View Profile</button>
            <button className="button-secondary">Send Message</button>
          </div>
        </div>

        {/* Quote to Review */}
        <div className="quote-section">
          <h3 className="section-title">Quote to Review</h3>

          <div className="quote-list">
            {quotes.map((quote) => (
              <div key={quote.id} className="quote-item">
                <span className="quote-amount">{quote.amount}</span>
                <span className="status-badge">{quote.status}</span>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <Link to="/quotes/create" className="button-primary">Edit Quote</Link>
            <button className="button-secondary">Send Quote</button>
          </div>
        </div>

        {/* Create Invoice */}
        <div className="invoice-section">
          <h3 className="section-title">Create Invoice</h3>

          <div className="invoice-list">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="invoice-item">
                <span className="invoice-number">{invoice.number}</span>
                <span className="invoice-amount">{invoice.amount}</span>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button className="button-primary">Create</button>
            <button className="button-secondary">Send Invoice</button>
          </div>
        </div>
      </section>

      {/* Lower Grid - Team Tracker, Recent Activity, Earning Report */}
      <section className="lower-grid">
        {/* Team Tracker */}
        <div className="lower-card">
          <h3 className="section-title">Team Tracker</h3>

          <div className="team-list">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-member">
                <div className="team-avatar"></div>
                <span className="team-name">{member.name}</span>
                <span className={`team-status status-${member.statusClass}`}>{member.status}</span>
              </div>
            ))}
          </div>

          <button className="button-primary">View Timesheet</button>
        </div>

        {/* Recent Activity */}
        <div className="lower-card">
          <h3 className="section-title">Recent Activity</h3>

          <div className="chart-section">
            <div className="revenue-info">
              <span className="revenue-percentage">98%</span>
              <span className="growth-badge">↑ 12%</span>
              <span className="vs-text">vs last year</span>
            </div>

            <div className="chart-container">
              <svg width="100%" height="172" viewBox="0 0 314 172" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgba(3, 201, 90, 0.42)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgba(129, 228, 173, 0.25)', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M 20 150 L 50 140 L 80 135 L 110 125 L 140 120 L 170 90 L 200 70 L 230 50 L 260 35 L 290 20 L 290 172 L 20 172 Z"
                      fill="url(#gradient)"/>
                <polyline fill="none" stroke="#03C95A" strokeWidth="3"
                          points="20,150 50,140 80,135 110,125 140,120 170,90 200,70 230,50 260,35 290,20"/>
              </svg>
            </div>
          </div>

          <Link to="/reports" className="button-primary">View Reports</Link>
        </div>

        {/* Earning Report */}
        <div className="lower-card">
          <h3 className="section-title">Earning Report</h3>

          <div className="bar-chart-container">
            <p className="revenue-amount">Revenue: $5,720</p>

            <div className="bar-chart">
              <div className="bar" style={{ height: '62px' }}></div>
              <div className="bar" style={{ height: '107px' }}></div>
              <div className="bar" style={{ height: '150px' }}></div>
            </div>
          </div>

          <Link to="/reports" className="button-primary">View Reports</Link>
        </div>
      </section>
    </div>
  );
};

// Helper function for stat icons
const getStatIcon = (color) => {
  switch (color) {
    case 'green':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
      );
    case 'orange':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
          <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 00-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
        </svg>
      );
    case 'brown':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      );
    case 'yellow':
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="4" width="16" height="15" rx="2" stroke="black" strokeWidth="2" fill="none"/>
          <line x1="3" y1="9" x2="19" y2="9" stroke="black" strokeWidth="2"/>
        </svg>
      );
    default:
      return null;
  }
};

export default Dashboard;
