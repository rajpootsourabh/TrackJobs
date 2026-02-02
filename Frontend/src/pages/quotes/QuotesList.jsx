import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { DUMMY_QUOTES } from '../../utils/constants';
import './Quotes.css';

const QuotesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [quotes] = useState(DUMMY_QUOTES);

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      draft: 'secondary',
      sent: 'info',
      accepted: 'success',
      rejected: 'danger',
    };
    return colors[status] || 'info';
  };

  return (
    <div className="quotes-page">
      <div className="page-header">
        <h1 className="page-title">Quotes</h1>
        <Link to="/quotes/create">
          <Button variant="primary">+ Create Quote</Button>
        </Link>
      </div>

      <div className="quotes-filters">
        <Input
          type="text"
          placeholder="Search quotes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="quotes-table-container card">
        <table className="quotes-table">
          <thead>
            <tr>
              <th>Quote #</th>
              <th>Title</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.map((quote) => (
              <tr key={quote.id}>
                <td>Q-{quote.id.toString().padStart(4, '0')}</td>
                <td>{quote.title}</td>
                <td>{quote.clientName}</td>
                <td className="amount">${quote.amount.toLocaleString()}</td>
                <td>{quote.date}</td>
                <td>
                  <span className={`badge badge-${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Button variant="ghost" size="small">View</Button>
                    <Button variant="ghost" size="small">Edit</Button>
                    {quote.status === 'draft' && (
                      <Button variant="primary" size="small">Send</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredQuotes.length === 0 && (
          <div className="empty-state">
            <p>No quotes found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotesList;
