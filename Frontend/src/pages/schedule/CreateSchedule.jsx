import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { DUMMY_CLIENTS, DUMMY_JOBS } from '../../utils/constants';
import './Schedule.css';

const CreateSchedule = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'meeting',
    date: '',
    startTime: '',
    endTime: '',
    clientId: '',
    jobId: '',
    location: '',
    description: '',
    reminder: '30',
  });
  const [errors, setErrors] = useState({});

  const eventTypes = [
    { value: 'meeting', label: 'Meeting' },
    { value: 'kickoff', label: 'Project Kickoff' },
    { value: 'review', label: 'Review' },
    { value: 'planning', label: 'Planning' },
    { value: 'call', label: 'Phone Call' },
    { value: 'other', label: 'Other' },
  ];

  const reminderOptions = [
    { value: '0', label: 'No reminder' },
    { value: '15', label: '15 minutes before' },
    { value: '30', label: '30 minutes before' },
    { value: '60', label: '1 hour before' },
    { value: '1440', label: '1 day before' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    console.log('Create schedule form submitted:', formData);

    setTimeout(() => {
      setLoading(false);
      navigate('/schedule');
    }, 1000);
  };

  return (
    <div className="create-schedule-page">
      <div className="page-header">
        <h1 className="page-title">Create Event</h1>
        <Link to="/schedule">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="schedule-form">
        <div className="form-section card">
          <h3 className="section-title">Event Details</h3>
          <div className="form-row">
            <Input
              type="text"
              name="title"
              label="Event Title"
              placeholder="Enter event title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Event Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-select"
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              type="date"
              name="date"
              label="Date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              required
            />
          </div>

          <div className="form-grid">
            <Input
              type="time"
              name="startTime"
              label="Start Time"
              value={formData.startTime}
              onChange={handleChange}
              error={errors.startTime}
              required
            />

            <Input
              type="time"
              name="endTime"
              label="End Time"
              value={formData.endTime}
              onChange={handleChange}
              error={errors.endTime}
              required
            />
          </div>
        </div>

        <div className="form-section card">
          <h3 className="section-title">Related To (Optional)</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Client</label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select a client (optional)</option>
                {DUMMY_CLIENTS.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Job</label>
              <select
                name="jobId"
                value={formData.jobId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select a job (optional)</option>
                {DUMMY_JOBS.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section card">
          <h3 className="section-title">Additional Information</h3>
          <div className="form-grid">
            <Input
              type="text"
              name="location"
              label="Location"
              placeholder="Enter location or meeting link"
              value={formData.location}
              onChange={handleChange}
            />

            <div className="form-group">
              <label className="form-label">Reminder</label>
              <select
                name="reminder"
                value={formData.reminder}
                onChange={handleChange}
                className="form-select"
              >
                {reminderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              placeholder="Add notes or description..."
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows={4}
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={() => navigate('/schedule')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Create Event
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSchedule;
