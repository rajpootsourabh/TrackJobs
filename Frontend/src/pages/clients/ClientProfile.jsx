import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { DUMMY_CLIENTS, DUMMY_JOBS, DUMMY_QUOTES, DUMMY_RECENT_ACTIVITY } from '../../utils/constants';
import './Clients.css';

const ClientProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('profile');

  // Find client by ID (using dummy data)
  const client = DUMMY_CLIENTS.find((c) => c.id === parseInt(id)) || DUMMY_CLIENTS[0];

  // Get client's jobs and quotes (dummy filtering)
  const clientJobs = DUMMY_JOBS.filter((job) => job.client === client.name || job.client === client.company);
  const clientQuotes = DUMMY_QUOTES.filter((quote) => quote.clientName === client.name || quote.clientName === client.company);
  const clientActivity = DUMMY_RECENT_ACTIVITY.slice(0, 5); // Get recent activity

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'quotes', label: 'Quotes' },
    { id: 'activity', label: 'Activity' },
  ];

  const getActivityIcon = (type) => {
    const icons = {
      client: '👤',
      quote: '📋',
      job: '🔧',
      schedule: '📅',
    };
    return icons[type] || '📌';
  };

  return (
    <div className="client-profile">
      <div className="page-header">
        <div className="header-left">
          <Link to="/clients" className="back-link">← Back to Clients</Link>
          <h1 className="page-title">{client.company || client.name}</h1>
        </div>
        <div className="header-actions">
          <Button variant="outline">Edit Client</Button>
          <Button variant="danger">Delete</Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <div className="tabs-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="tab-content">
          <div className="profile-grid">
            {/* Client Info Card */}
            <div className="profile-card card">
              <h3 className="card-title">Client Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Company Name</span>
                  <span className="info-value">{client.company}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Contact Person</span>
                  <span className="info-value">{client.contactPerson || client.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{client.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{client.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span className={`badge badge-${client.status === 'active' ? 'success' : 'warning'}`}>
                    {client.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="profile-card card">
              <h3 className="card-title">Overview</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">{clientJobs.length}</span>
                  <span className="stat-text">Total Jobs</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{clientQuotes.length}</span>
                  <span className="stat-text">Quotes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">$12,500</span>
                  <span className="stat-text">Total Revenue</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="tab-content">
          <div className="profile-section card">
            <div className="section-header">
              <h3 className="card-title">All Jobs</h3>
              <Link to="/jobs/add">
                <Button variant="primary" size="small">+ Add Job</Button>
              </Link>
            </div>
            {clientJobs.length > 0 ? (
              <table className="profile-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clientJobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.title}</td>
                      <td>
                        <span className={`badge badge-${getStatusColor(job.status)}`}>
                          {formatStatus(job.status)}
                        </span>
                      </td>
                      <td>{job.dueDate}</td>
                      <td>
                        <Link to={`/jobs/${job.id}`}>
                          <Button variant="ghost" size="small">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-message">No jobs found for this client.</p>
            )}
          </div>
        </div>
      )}

      {/* Quotes Tab */}
      {activeTab === 'quotes' && (
        <div className="tab-content">
          <div className="profile-section card">
            <div className="section-header">
              <h3 className="card-title">All Quotes</h3>
              <Link to="/quotes/add">
                <Button variant="primary" size="small">+ Create Quote</Button>
              </Link>
            </div>
            {clientQuotes.length > 0 ? (
              <table className="profile-table">
                <thead>
                  <tr>
                    <th>Quote Title</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clientQuotes.map((quote) => (
                    <tr key={quote.id}>
                      <td>{quote.title}</td>
                      <td>${quote.amount.toLocaleString()}</td>
                      <td>
                        <span className={`badge badge-${getQuoteStatusColor(quote.status)}`}>
                          {quote.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/quotes/${quote.id}`}>
                          <Button variant="ghost" size="small">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-message">No quotes found for this client.</p>
            )}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="tab-content">
          <div className="profile-section card">
            <h3 className="card-title">Recent Activity</h3>
            <div className="activity-list">
              {clientActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-info">
                    <p className="activity-description">{activity.description}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    cancelled: 'danger',
  };
  return colors[status] || 'info';
};

const formatStatus = (status) => {
  return status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const getQuoteStatusColor = (status) => {
  const colors = {
    draft: 'secondary',
    sent: 'info',
    accepted: 'success',
    rejected: 'danger',
  };
  return colors[status] || 'info';
};

export default ClientProfile;
