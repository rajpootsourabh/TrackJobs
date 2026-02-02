// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.trakjobs.com/api/v1';

// Application Name
export const APP_NAME = 'TrakJobs';

// Navigation Items
export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/clients', label: 'Clients', icon: 'people' },
  { path: '/quotes', label: 'Quotes', icon: 'description' },
  { path: '/jobs', label: 'Jobs', icon: 'work' },
  { path: '/schedule', label: 'Schedule', icon: 'calendar' },
];

// Job Status Options
export const JOB_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const JOB_STATUS_LABELS = {
  [JOB_STATUS.PENDING]: 'Pending',
  [JOB_STATUS.IN_PROGRESS]: 'In Progress',
  [JOB_STATUS.COMPLETED]: 'Completed',
  [JOB_STATUS.CANCELLED]: 'Cancelled',
};

// Quote Status Options
export const QUOTE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const QUOTE_STATUS_LABELS = {
  [QUOTE_STATUS.DRAFT]: 'Draft',
  [QUOTE_STATUS.SENT]: 'Sent',
  [QUOTE_STATUS.ACCEPTED]: 'Accepted',
  [QUOTE_STATUS.REJECTED]: 'Rejected',
};

// Schedule Status
export const SCHEDULE_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  RESCHEDULED: 'rescheduled',
};

// Dummy Data for Development
export const DUMMY_CLIENTS = [
  { id: 1, name: 'John Smith', email: 'john@example.com', phone: '555-0101', company: 'Smith Corp', status: 'active', contactPerson: 'John Smith' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-0102', company: 'Johnson LLC', status: 'active', contactPerson: 'Sarah Johnson' },
  { id: 3, name: 'Mike Davis', email: 'mike@example.com', phone: '555-0103', company: 'Davis Industries', status: 'inactive', contactPerson: 'Mike Davis' },
  { id: 4, name: 'Emily Brown', email: 'emily@example.com', phone: '555-0104', company: 'Brown & Co', status: 'active', contactPerson: 'Emily Brown' },
  { id: 5, name: 'David Wilson', email: 'david@example.com', phone: '555-0105', company: 'Wilson Tech', status: 'active', contactPerson: 'David Wilson' },
];

export const DUMMY_QUOTES = [
  { id: 1, clientName: 'John Smith', title: 'Website Redesign', amount: 5000, status: 'sent', date: '2026-01-15' },
  { id: 2, clientName: 'Sarah Johnson', title: 'Mobile App Development', amount: 15000, status: 'accepted', date: '2026-01-20' },
  { id: 3, clientName: 'Mike Davis', title: 'SEO Services', amount: 2000, status: 'draft', date: '2026-01-25' },
  { id: 4, clientName: 'Emily Brown', title: 'Brand Identity', amount: 3500, status: 'rejected', date: '2026-01-28' },
];

export const DUMMY_JOBS = [
  { id: 1, title: 'Website Redesign', client: 'John Smith', status: 'in_progress', startDate: '2026-01-20', dueDate: '2026-02-20', priority: 'high' },
  { id: 2, title: 'Mobile App Development', client: 'Sarah Johnson', status: 'pending', startDate: '2026-02-01', dueDate: '2026-04-01', priority: 'high' },
  { id: 3, title: 'Logo Design', client: 'Emily Brown', status: 'completed', startDate: '2026-01-10', dueDate: '2026-01-25', priority: 'medium' },
  { id: 4, title: 'Database Migration', client: 'David Wilson', status: 'in_progress', startDate: '2026-01-15', dueDate: '2026-02-15', priority: 'low' },
];

export const DUMMY_SCHEDULES = [
  { id: 1, title: 'Client Meeting - John Smith', date: '2026-01-31', time: '10:00 AM', duration: '1 hour', type: 'meeting' },
  { id: 2, title: 'Project Kickoff - Mobile App', date: '2026-01-31', time: '2:00 PM', duration: '2 hours', type: 'kickoff' },
  { id: 3, title: 'Design Review', date: '2026-01-31', time: '4:00 PM', duration: '1.5 hours', type: 'review' },
  { id: 4, title: 'Sprint Planning', date: '2026-02-01', time: '9:00 AM', duration: '2 hours', type: 'planning' },
];

// Recent Activity (Dummy)
export const DUMMY_RECENT_ACTIVITY = [
  { id: 1, action: 'New client added', description: 'John Smith was added as a new client', time: '2 hours ago', type: 'client' },
  { id: 2, action: 'Quote accepted', description: 'Sarah Johnson accepted quote for Mobile App', time: '3 hours ago', type: 'quote' },
  { id: 3, action: 'Job completed', description: 'Logo Design for Emily Brown completed', time: '5 hours ago', type: 'job' },
  { id: 4, action: 'Meeting scheduled', description: 'Client meeting with David Wilson', time: '1 day ago', type: 'schedule' },
  { id: 5, action: 'Quote sent', description: 'Website Redesign quote sent to John Smith', time: '1 day ago', type: 'quote' },
];

// Dashboard Stats (Dummy)
export const DASHBOARD_STATS = {
  totalClients: 45,
  activeJobs: 12,
  pendingQuotes: 8,
  pendingJobs: 5,
  scheduledTasks: 15,
  revenue: 125000,
  completedJobs: 87,
};
