import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useClient } from '../../hooks/useClients';
import { DUMMY_CLIENTS } from '../../utils/constants';
import Loader from '../../components/common/Loader';
import './Clients.css';

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Use the client hook for API integration
  const { client: apiClient, loading, error, fetchClient, deleteExistingClient, deleting } = useClient(id);

  // Fetch client on mount
  useEffect(() => {
    if (id) {
      fetchClient(id);
    }
  }, [id]);

  // Find client from dummy data as fallback
  const dummyClient = DUMMY_CLIENTS.find((c) => c.id === parseInt(id)) || {
    id: 1,
    name: 'Jessica Freeman',
    company: 'Jessica Freeman',
    address: '231 Oak St.',
    email: 'jessica@example.com',
    phone: '552-456-4456',
    status: 'active',
  };

  // Use API client if available, otherwise fall back to dummy data
  const client = apiClient || dummyClient;

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'quote', label: 'Quote' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'emails', label: 'Emails' },
  ];

  // Dummy service history data
  const serviceHistory = [
    { id: 1, name: 'Gardening Service 231 Oak St.', date: 'April 10, 2025', status: 'done' },
    { id: 2, name: 'HVAC Maintenance 231 Oak St.', date: 'April 10, 2025', status: 'done' },
    { id: 3, name: 'Pressure Washing 231 Oak St.', date: 'April 10, 2025', status: 'done' },
    { id: 4, name: 'AC Repair 231 Oak St.', date: 'April 10, 2025', status: 'done' },
    { id: 5, name: 'Home Maintenance 231 Oak St.', date: 'April 10, 2025', status: 'done' },
  ];

  // Dummy client notes data
  const clientNotes = [
    { id: 1, date: 'December 1, 2025', note: 'Prefer rose bushes and hydrangeas.' },
    { id: 2, date: 'December 1, 2025', note: 'Prefer rose bushes and hydrangeas.' },
    { id: 3, date: 'December 1, 2025', note: 'Prefer rose bushes and hydrangeas.' },
    { id: 4, date: 'December 1, 2025', note: 'Prefer rose bushes and hydrangeas.' },
    { id: 5, date: 'December 1, 2025', note: 'Prefer rose bushes and hydrangeas.' },
  ];

  // Dummy communication data
  const communications = [
    { id: 1, text: 'Invoice #1357 from TrackJobs', status: 'done' },
    { id: 2, text: 'Please review quote #77 from TrackJobs', status: 'done' },
    { id: 3, text: 'Please review quote #77 from TrackJobs', status: 'done' },
    { id: 4, text: 'Please review quote #77 from TrackJobs', status: 'done' },
    { id: 5, text: 'Please review quote #77 from TrackJobs', status: 'done' },
  ];

  // Handle delete client
  const handleDeleteClient = async () => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      const success = await deleteExistingClient(id);
      if (success) {
        navigate('/clients');
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="client-profile">
        <div className="breadcrumb-bar">
          <span className="breadcrumb-text">
            <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
            {' / '}
            <Link to="/clients" className="breadcrumb-link">Clients</Link>
            {' / '}
            <span className="breadcrumb-current">Client Profile</span>
          </span>
        </div>
        <div className="profile-loading-container">
          <Loader />
          <p>Loading client profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !apiClient) {
    return (
      <div className="client-profile">
        <div className="breadcrumb-bar">
          <span className="breadcrumb-text">
            <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
            {' / '}
            <Link to="/clients" className="breadcrumb-link">Clients</Link>
            {' / '}
            <span className="breadcrumb-current">Client Profile</span>
          </span>
        </div>
        <div className="profile-error-container">
          <p>{error}</p>
          <button onClick={() => fetchClient(id)} className="retry-btn">Retry</button>
          <Link to="/clients" className="back-link">Back to Clients</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="client-profile">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <span className="breadcrumb-text">
          <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
          {' / '}
          <Link to="/clients" className="breadcrumb-link">Clients</Link>
          {' / '}
          <span className="breadcrumb-current">Client Profile</span>
        </span>
      </div>

      {/* Client Summary Card */}
      <section className="client-summary-card">
        <div className="client-avatar">
          <span className="avatar-text">{client.name?.charAt(0) || client.company?.charAt(0) || 'J'}</span>
        </div>

        <div className="client-basic-info">
          <h1 className="client-name">{client.company || client.businessName || client.name || 'Jessica Freeman'}</h1>
          <p className="client-address">{client.address || client.addressLine1 || '231 Oak St.'}</p>
        </div>

        <div className="client-tags">
          <span className="tag tag-vip">VIP Customer</span>
          <span className="tag tag-weekly">Weekly Service</span>
        </div>

        <div className="client-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate(`/clients/${id}/edit`)}
          >
            Edit Client
          </button>
          <button 
            className="btn-outline"
            onClick={() => navigate('/quotes/add')}
          >
            New Quote
          </button>
        </div>
      </section>

      {/* Tabs */}
      <section className="profile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {/* Content Area */}
      {activeTab === 'profile' && (
        <main className="profile-content">
          {/* Service History Card */}
          <section className="card service-history">
            <h3 className="card-header">Service History</h3>
            <ul className="history-list">
              {serviceHistory.map((service) => (
                <li key={service.id} className="history-item">
                  <span className="status-icon done">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="service-name">{service.name}</span>
                  <span className="service-date">
                    <svg className="calendar-icon" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="2" width="13" height="12" rx="2" stroke="#000" strokeWidth="1"/>
                      <path d="M1 6H14" stroke="#000" strokeWidth="1"/>
                      <path d="M4 1V3" stroke="#000" strokeWidth="1" strokeLinecap="round"/>
                      <path d="M11 1V3" stroke="#000" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                    {service.date}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Client Notes Card */}
          <section className="card client-notes">
            <h3 className="card-header">Client Notes</h3>
            <ul className="notes-list">
              {clientNotes.map((note) => (
                <li key={note.id} className="note-item">
                  <span className="note-date">
                    <svg className="calendar-icon" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="2" width="13" height="12" rx="2" stroke="#000" strokeWidth="1"/>
                      <path d="M1 6H14" stroke="#000" strokeWidth="1"/>
                      <path d="M4 1V3" stroke="#000" strokeWidth="1" strokeLinecap="round"/>
                      <path d="M11 1V3" stroke="#000" strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                    {note.date}
                  </span>
                  <p className="note-text">{note.note}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Communication Card */}
          <section className="card communication">
            <h3 className="card-header">Communication</h3>
            <ul className="communication-list">
              {communications.map((comm) => (
                <li key={comm.id} className="comm-item">
                  <span className="comm-check">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="comm-text">{comm.text}</span>
                </li>
              ))}
            </ul>

            <div className="call-box">
              <div className="call-icon">
                <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.97 17.33C20.97 17.69 20.89 18.06 20.72 18.42C20.55 18.78 20.33 19.12 20.04 19.44C19.55 19.98 19.01 20.37 18.4 20.62C17.8 20.87 17.15 21 16.45 21C15.43 21 14.34 20.76 13.19 20.27C12.04 19.78 10.89 19.12 9.75 18.29C8.6 17.45 7.51 16.52 6.47 15.49C5.44 14.45 4.51 13.36 3.68 12.22C2.86 11.08 2.2 9.94 1.72 8.81C1.24 7.67 1 6.58 1 5.54C1 4.86 1.12 4.21 1.36 3.61C1.6 3 1.98 2.44 2.51 1.94C3.15 1.31 3.85 1 4.59 1C4.87 1 5.15 1.06 5.4 1.18C5.66 1.3 5.89 1.48 6.07 1.74L8.39 5.01C8.57 5.26 8.7 5.49 8.79 5.71C8.88 5.92 8.93 6.13 8.93 6.32C8.93 6.56 8.86 6.8 8.72 7.03C8.59 7.26 8.4 7.5 8.16 7.74L7.4 8.53C7.29 8.64 7.24 8.77 7.24 8.93C7.24 9.01 7.25 9.08 7.27 9.16C7.3 9.24 7.33 9.3 7.35 9.36C7.53 9.69 7.84 10.12 8.28 10.64C8.73 11.16 9.21 11.69 9.73 12.22C10.27 12.75 10.79 13.24 11.32 13.69C11.84 14.13 12.27 14.43 12.61 14.61C12.66 14.63 12.72 14.66 12.79 14.69C12.87 14.72 12.95 14.73 13.04 14.73C13.21 14.73 13.34 14.67 13.45 14.56L14.21 13.81C14.46 13.56 14.7 13.37 14.93 13.25C15.16 13.11 15.39 13.04 15.64 13.04C15.83 13.04 16.03 13.08 16.25 13.17C16.47 13.26 16.7 13.39 16.95 13.56L20.26 15.91C20.52 16.09 20.7 16.3 20.81 16.55C20.91 16.8 20.97 17.05 20.97 17.33Z" stroke="#2A5377" strokeWidth="1.5" strokeMiterlimit="10"/>
                </svg>
              </div>
              <div className="call-info">
                <p className="call-title">Call</p>
                <p className="call-number">Answered {client.phone || '552-456-4456'}</p>
              </div>
              <span className="call-date">Feb 25, 2025</span>
            </div>
          </section>
        </main>
      )}

      {/* Jobs Tab Content */}
      {activeTab === 'jobs' && (
        <main className="profile-content">
          <section className="card">
            <h3 className="card-header">Jobs</h3>
            <p className="empty-message">No jobs found for this client.</p>
          </section>
        </main>
      )}

      {/* Quote Tab Content */}
      {activeTab === 'quote' && (
        <main className="profile-content">
          <section className="card">
            <h3 className="card-header">Quotes</h3>
            <p className="empty-message">No quotes found for this client.</p>
          </section>
        </main>
      )}

      {/* Invoices Tab Content */}
      {activeTab === 'invoices' && (
        <main className="profile-content">
          <section className="card">
            <h3 className="card-header">Invoices</h3>
            <p className="empty-message">No invoices found for this client.</p>
          </section>
        </main>
      )}

      {/* Emails Tab Content */}
      {activeTab === 'emails' && (
        <main className="profile-content">
          <section className="card">
            <h3 className="card-header">Emails</h3>
            <p className="empty-message">No emails found for this client.</p>
          </section>
        </main>
      )}
    </div>
  );
};

export default ClientProfile;
