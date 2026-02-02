import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { APP_NAME } from '../../utils/constants';
import { forgotPassword } from '../../services/authService';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    // Clear errors when user types
    if (error) {
      setError('');
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setApiError('');
    setSuccessMessage('');

    try {
      await forgotPassword({ email });
      
      setIsSubmitted(true);
      setSuccessMessage('Password reset link sent to your email. Please check your inbox.');
    } catch (error) {
      // Handle error gracefully - don't reveal if email exists or not for security
      // Some APIs may return success even if email doesn't exist
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setIsSubmitted(false);
    setSuccessMessage('');
    setApiError('');
  };

  return (
    <div className="auth-container">
      <h1 className="auth-logo">{APP_NAME}</h1>
      <div className="auth-card">
        <div className="auth-header">
          <p className="auth-subtitle">FORGOT PASSWORD</p>
        </div>

        {isSubmitted && successMessage ? (
          <div className="auth-form">
            <div className="auth-success-message">
              {successMessage}
            </div>
            <p className="auth-info-text">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
            <Button
              type="button"
              variant="primary"
              size="large"
              className="auth-submit"
              onClick={handleResend}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <p className="auth-description">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            {apiError && (
              <div className="auth-error-message">
                {apiError}
              </div>
            )}

            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleChange}
              error={error}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="auth-submit"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <p className="auth-footer">
          Remember your password?{' '}
          <Link to="/login" className="auth-link">
            Login Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
