import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { DUMMY_CLIENTS } from '../../utils/constants';
import './Clients.css';

const ClientList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients] = useState(DUMMY_CLIENTS);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.contactPerson && client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="clients-page">
      <div className="page-header">
        <h1 className="page-title">Clients</h1>
        <Link to="/clients/add">
          <Button variant="primary">+ Add Client</Button>
        </Link>
      </div>

      <div className="clients-filters">
        <Input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="clients-table-container card">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td>
                  <Link to={`/clients/${client.id}`} className="client-name">
                    {client.company}
                  </Link>
                </td>
                <td>{client.contactPerson || client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>
                  <span className={`badge badge-${client.status === 'active' ? 'success' : 'warning'}`}>
                    {client.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/clients/${client.id}`}>
                      <Button variant="ghost" size="small">View</Button>
                    </Link>
                    <Button variant="ghost" size="small">Edit</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <div className="empty-state">
            <p>No clients found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;
