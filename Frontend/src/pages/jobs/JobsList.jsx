import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { DUMMY_JOBS, JOB_STATUS_LABELS } from '../../utils/constants';
import './Jobs.css';

const JobsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobs] = useState(DUMMY_JOBS);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      in_progress: 'info',
      completed: 'success',
      cancelled: 'danger',
    };
    return colors[status] || 'info';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'danger',
      medium: 'warning',
      low: 'success',
    };
    return colors[priority] || 'info';
  };

  return (
    <div className="jobs-page">
      <div className="page-header">
        <h1 className="page-title">Jobs</h1>
        <Button variant="primary">+ Create Job</Button>
      </div>

      <div className="jobs-filters">
        <Input
          type="text"
          placeholder="Search jobs..."
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
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="jobs-grid">
        {filteredJobs.map((job) => (
          <Link to={`/jobs/${job.id}`} key={job.id} className="job-card card">
            <div className="job-header">
              <span className={`badge badge-${getPriorityColor(job.priority)}`}>
                {job.priority}
              </span>
              <span className={`badge badge-${getStatusColor(job.status)}`}>
                {JOB_STATUS_LABELS[job.status] || job.status}
              </span>
            </div>
            <h3 className="job-title">{job.title}</h3>
            <p className="job-client">Client: {job.client}</p>
            <div className="job-dates">
              <div className="date-item">
                <span className="date-label">Start</span>
                <span className="date-value">{job.startDate}</span>
              </div>
              <div className="date-item">
                <span className="date-label">Due</span>
                <span className="date-value">{job.dueDate}</span>
              </div>
            </div>
            <div className="job-footer">
              <Button variant="outline" size="small">View Details</Button>
            </div>
          </Link>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="empty-state card">
          <p>No jobs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default JobsList;
