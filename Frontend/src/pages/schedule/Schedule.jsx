import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { DUMMY_SCHEDULES } from '../../utils/constants';
import './Schedule.css';

const Schedule = () => {
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  const [schedules] = useState(DUMMY_SCHEDULES);

  // Get current week dates (dummy implementation)
  const getCurrentWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getCurrentWeekDates();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getTypeColor = (type) => {
    const colors = {
      meeting: 'blue',
      kickoff: 'green',
      review: 'orange',
      planning: 'purple',
    };
    return colors[type] || 'blue';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="schedule-page">
      <div className="page-header">
        <h1 className="page-title">Schedule</h1>
        <div className="header-actions">
          <div className="view-toggle">
            <button
              className={`view-btn ${view === 'day' ? 'active' : ''}`}
              onClick={() => setView('day')}
            >
              Day
            </button>
            <button
              className={`view-btn ${view === 'week' ? 'active' : ''}`}
              onClick={() => setView('week')}
            >
              Week
            </button>
            <button
              className={`view-btn ${view === 'month' ? 'active' : ''}`}
              onClick={() => setView('month')}
            >
              Month
            </button>
          </div>
          <Link to="/schedule/create">
            <Button variant="primary">+ Add Event</Button>
          </Link>
        </div>
      </div>

      {/* Week View */}
      <div className="schedule-calendar card">
        <div className="calendar-header">
          <button className="nav-btn">←</button>
          <h3 className="calendar-title">
            {formatDate(weekDates[0])} - {formatDate(weekDates[6])}, 2026
          </h3>
          <button className="nav-btn">→</button>
        </div>

        <div className="calendar-grid">
          <div className="calendar-days">
            {weekDates.map((date, index) => (
              <div key={index} className="calendar-day-header">
                <span className="day-name">{dayNames[index]}</span>
                <span className="day-date">{date.getDate()}</span>
              </div>
            ))}
          </div>

          <div className="calendar-content">
            {weekDates.map((date, index) => (
              <div key={index} className="calendar-day-column">
                {/* Sample events - in real app would filter by date */}
                {index < schedules.length && (
                  <div className={`event-card event-${getTypeColor(schedules[index].type)}`}>
                    <span className="event-time">{schedules[index].time}</span>
                    <span className="event-title">{schedules[index].title}</span>
                    <span className="event-duration">{schedules[index].duration}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="upcoming-section">
        <h3 className="section-title">Upcoming Events</h3>
        <div className="events-list">
          {schedules.map((schedule) => (
            <div key={schedule.id} className={`event-item event-item-${getTypeColor(schedule.type)}`}>
              <div className="event-date-box">
                <span className="event-month">
                  {new Date(schedule.date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="event-day">
                  {new Date(schedule.date).getDate()}
                </span>
              </div>
              <div className="event-details">
                <h4 className="event-name">{schedule.title}</h4>
                <p className="event-info">
                  {schedule.time} • {schedule.duration}
                </p>
              </div>
              <div className="event-actions">
                <Button variant="ghost" size="small">Edit</Button>
                <Button variant="ghost" size="small">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
