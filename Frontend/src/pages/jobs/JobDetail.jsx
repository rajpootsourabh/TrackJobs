import { useParams, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { DUMMY_JOBS, JOB_STATUS_LABELS, DUMMY_SCHEDULES } from '../../utils/constants';
import './Jobs.css';

const JobDetail = () => {
  const { id } = useParams();

  // Find job by ID (using dummy data)
  const job = DUMMY_JOBS.find((j) => j.id === parseInt(id)) || DUMMY_JOBS[0];

  // Dummy tasks for the job
  const tasks = [
    { id: 1, title: 'Initial consultation', status: 'completed', assignee: 'John Doe' },
    { id: 2, title: 'Design mockups', status: 'completed', assignee: 'Jane Smith' },
    { id: 3, title: 'Development phase 1', status: 'in_progress', assignee: 'John Doe' },
    { id: 4, title: 'Testing', status: 'pending', assignee: 'Mike Johnson' },
    { id: 5, title: 'Deployment', status: 'pending', assignee: 'John Doe' },
  ];

  // Dummy activity log
  const activity = [
    { id: 1, action: 'Job created', user: 'Admin', timestamp: '2026-01-20 09:00' },
    { id: 2, action: 'Status changed to In Progress', user: 'John Doe', timestamp: '2026-01-20 10:30' },
    { id: 3, action: 'Task "Initial consultation" completed', user: 'John Doe', timestamp: '2026-01-21 14:00' },
    { id: 4, action: 'Task "Design mockups" completed', user: 'Jane Smith', timestamp: '2026-01-25 16:00' },
  ];

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

  const calculateProgress = () => {
    const completed = tasks.filter((t) => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className="job-detail">
      <div className="page-header">
        <div className="header-left">
          <Link to="/jobs" className="back-link">← Back to Jobs</Link>
          <h1 className="page-title">{job.title}</h1>
          <div className="job-badges">
            <span className={`badge badge-${getPriorityColor(job.priority)}`}>
              {job.priority} priority
            </span>
            <span className={`badge badge-${getStatusColor(job.status)}`}>
              {JOB_STATUS_LABELS[job.status] || job.status}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <Button variant="outline">Edit Job</Button>
          <Button variant="primary">Update Status</Button>
        </div>
      </div>

      <div className="job-detail-grid">
        {/* Job Info */}
        <div className="detail-card card">
          <h3 className="card-title">Job Information</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Client</span>
              <span className="info-value">{job.client}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Start Date</span>
              <span className="info-value">{job.startDate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Due Date</span>
              <span className="info-value">{job.dueDate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Priority</span>
              <span className={`badge badge-${getPriorityColor(job.priority)}`}>
                {job.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="detail-card card">
          <h3 className="card-title">Progress</h3>
          <div className="progress-container">
            <div className="progress-header">
              <span className="progress-label">Overall Progress</span>
              <span className="progress-percentage">{calculateProgress()}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <div className="progress-stats">
              <span>{tasks.filter((t) => t.status === 'completed').length} of {tasks.length} tasks completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="detail-section card">
        <div className="section-header">
          <h3 className="card-title">Tasks</h3>
          <Button variant="outline" size="small">+ Add Task</Button>
        </div>
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-item">
              <div className="task-checkbox">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => console.log('Toggle task:', task.id)}
                />
              </div>
              <div className="task-info">
                <span className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>
                  {task.title}
                </span>
                <span className="task-assignee">Assigned to: {task.assignee}</span>
              </div>
              <span className={`badge badge-${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div className="detail-section card">
        <h3 className="card-title">Activity Log</h3>
        <div className="activity-list">
          {activity.map((item) => (
            <div key={item.id} className="activity-item">
              <div className="activity-dot"></div>
              <div className="activity-content">
                <span className="activity-action">{item.action}</span>
                <span className="activity-meta">
                  by {item.user} • {item.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
