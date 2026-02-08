import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClients } from '../../hooks/useClients';
import { DUMMY_CLIENTS } from '../../utils/constants';
import Loader from '../../components/common/Loader';
import './Clients.css';

const ClientList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const searchDebounceRef = useRef(null);

  // Use the clients hook for API integration
  const {
    clients,
    loading,
    error,
    pagination,
    handleSearch,
    handlePageChange: changePage,
    handleSort,
    refresh,
  } = useClients({ limit: 5 });

  // Use API clients if available, otherwise fall back to dummy data
  const displayClients = clients.length > 0 ? clients : DUMMY_CLIENTS;
  const isUsingDummyData = clients.length === 0 && !loading;

  // Local pagination for dummy data fallback
  const [localPage, setLocalPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination based on data source
  const currentPage = isUsingDummyData ? localPage : pagination.currentPage;
  const totalItems = isUsingDummyData ? displayClients.length : pagination.totalItems;
  const totalPages = isUsingDummyData 
    ? Math.ceil(displayClients.length / itemsPerPage) 
    : pagination.totalPages;

  // Filter clients locally for dummy data
  const filteredClients = isUsingDummyData
    ? displayClients.filter(
        (client) =>
          client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (client.contactPerson && client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : displayClients;

  // Paginate locally for dummy data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredClients.length);
  const paginatedClients = isUsingDummyData
    ? filteredClients.slice(startIndex, startIndex + itemsPerPage)
    : filteredClients;

  // Handle search with debounce
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    // Debounce API search
    searchDebounceRef.current = setTimeout(() => {
      if (!isUsingDummyData) {
        handleSearch(value);
      }
    }, 300);
  }, [handleSearch, isUsingDummyData]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    if (isUsingDummyData) {
      setLocalPage(page);
    } else {
      changePage(page);
    }
    setSelectAll(false);
    setSelectedClients([]);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClients([]);
    } else {
      setSelectedClients(paginatedClients.map(client => client.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual client selection
  const handleSelectClient = (clientId) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get category badge class
  const getCategoryClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'enterprise':
        return 'category-enterprise';
      case 'premium':
        return 'category-premium';
      default:
        return 'category-regular';
    }
  };

  // Get status display
  const getStatusDisplay = (status) => {
    const isActive = status?.toLowerCase() === 'active';
    return {
      text: isActive ? 'Active' : 'Inactive',
      isActive,
    };
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const total = isUsingDummyData 
      ? Math.ceil(filteredClients.length / itemsPerPage) 
      : totalPages;

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2, 3);
      if (total > 4) pages.push(total);
    }
    return pages;
  };

  // Handle column sort
  const handleColumnSort = (column) => {
    if (!isUsingDummyData) {
      handleSort(column);
    }
  };

  // Calculate display range
  const displayStart = paginatedClients.length > 0 ? startIndex + 1 : 0;
  const displayEnd = isUsingDummyData 
    ? Math.min(startIndex + itemsPerPage, filteredClients.length)
    : Math.min(startIndex + paginatedClients.length, totalItems);
  const displayTotal = isUsingDummyData ? filteredClients.length : totalItems;

  return (
    <div className="clients-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <span className="breadcrumb-text">
          <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
          {' / '}
          <span className="breadcrumb-current">Clients</span>
        </span>
      </div>

      {/* Page Header with Search and Add Button */}
      <div className="client-list-header">
        <h1 className="client-list-title">Clients</h1>
        <div className="client-list-actions">
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="5.5" stroke="#BEBEBE" strokeWidth="1.5"/>
              <path d="M12 12L15.5 15.5" stroke="#BEBEBE" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search Clients..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input-field"
            />
          </div>
          <button 
            className="new-client-btn"
            onClick={() => navigate('/clients/add')}
          >
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3.5V12.5M3.5 8H12.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>New Client</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message-banner">
          <p>{error}</p>
          <button onClick={refresh} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="table-loading-container">
          <Loader />
          <p>Loading clients...</p>
        </div>
      )}

      {/* Client Table */}
      {!loading && (
        <div className="client-table-card">
          <table className="client-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input 
                    type="checkbox" 
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="table-checkbox"
                  />
                </th>
                <th>
                  <div className="th-content" onClick={() => handleColumnSort('company')}>
                    Company Name
                    <svg className="sort-icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 8L2 4H10L6 8Z" fill="#6C6A6A"/>
                    </svg>
                  </div>
                </th>
                <th>
                  <div className="th-content" onClick={() => handleColumnSort('contact_person')}>
                    Contact Person
                    <svg className="sort-icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 8L2 4H10L6 8Z" fill="#6C6A6A"/>
                    </svg>
                  </div>
                </th>
                <th>Email Address</th>
                <th>
                  <div className="th-content" onClick={() => handleColumnSort('phone')}>
                    Phone Number
                    <svg className="sort-icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 8L2 4H10L6 8Z" fill="#6C6A6A"/>
                    </svg>
                  </div>
                </th>
                <th>Client Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.map((client) => {
                const status = getStatusDisplay(client.status);
                return (
                  <tr key={client.id} className={selectedClients.includes(client.id) ? 'selected' : ''}>
                    <td className="checkbox-col">
                      <input 
                        type="checkbox" 
                        checked={selectedClients.includes(client.id)}
                        onChange={() => handleSelectClient(client.id)}
                        className="table-checkbox"
                      />
                    </td>
                    <td>
                      <Link to={`/clients/${client.id}`} className="company-cell">
                        <span className="company-name">{client.company || client.businessName}</span>
                        <span className="company-sector">{client.businessType || 'Technology Sector'}</span>
                      </Link>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <div className="contact-avatar">
                          {client.avatar ? (
                            <img src={client.avatar} alt={client.contactPerson || client.name} />
                          ) : (
                            <span className="avatar-initials">
                              {getInitials(client.contactPerson || client.name)}
                            </span>
                          )}
                        </div>
                        <div className="contact-info">
                          <span className="contact-name">{client.contactPerson || client.name}</span>
                          <span className="contact-subname">{client.contactPerson || client.name}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="email-cell">
                        <span className="email-text">{client.email}</span>
                      </div>
                    </td>
                    <td>{client.phone || client.mobileNumber}</td>
                    <td>
                      <span className={`category-badge ${getCategoryClass(client.category || client.clientCategory)}`}>
                        {client.category || client.clientCategory || 'Regular'}
                      </span>
                    </td>
                    <td>
                      <div className="status-cell">
                        {status.isActive ? (
                          <svg className="status-check" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7" fill="#E8F5E9"/>
                            <path d="M5 8L7 10L11 6" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg className="status-check" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7" fill="#FFEBEE"/>
                            <path d="M5 5L11 11M11 5L5 11" stroke="#F44336" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        )}
                        <span className={`status-text ${status.isActive ? '' : 'inactive'}`}>
                          {status.text}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {paginatedClients.length === 0 && !loading && (
            <div className="empty-table-message">
              <p>No clients found{searchTerm ? ' matching your search' : ''}.</p>
              {!searchTerm && (
                <button 
                  className="btn-add-first"
                  onClick={() => navigate('/clients/add')}
                >
                  Add Your First Client
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {paginatedClients.length > 0 && (
            <div className="table-pagination">
              <span className="pagination-info">
                Showing {displayStart} - {displayEnd} out of {displayTotal} results
              </span>
              <div className="pagination-numbers">
                {getPageNumbers().map((page) => (
                  <span
                    key={page}
                    className={`page-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientList;
