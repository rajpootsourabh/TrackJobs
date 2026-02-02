import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { APP_NAME } from '../../utils/constants';
import { login } from '../../services/authService';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check for success message from registration or password reset
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the location state to prevent message from showing again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    // Clear messages when user types
    if (apiError) {
      setApiError('');
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });
      
      // Check if we got a valid response
      if (response) {
        // Redirect to intended destination or dashboard
        const from = location.state?.from || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Show backend error message
      setApiError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-logo">{APP_NAME}</h1>
      <div className="auth-card">
        <div className="auth-header">
          <p className="auth-subtitle">LOGIN</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {successMessage && (
            <div className="auth-success-message">
              {successMessage}
            </div>
          )}

          {apiError && (
            <div className="auth-error-message">
              {apiError}
            </div>
          )}

          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <div className="forgot-password-wrapper">
            <Link to="/forgot-password" className="auth-link forgot-password-link">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            className="auth-submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="auth-footer">
          If you haven't Registered yet?{' '}
          <Link to="/register" className="auth-link">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
