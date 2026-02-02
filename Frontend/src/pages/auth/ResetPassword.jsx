import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { APP_NAME } from '../../utils/constants';
import { resetPassword } from '../../services/authService';
import './Auth.css';

/**
 * Validate password strength
 * Requirements: uppercase, lowercase, number, special character, min 8 chars
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
const validatePasswordStrength = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('one number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('one special character (!@#$%^&*...)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get token and email from URL query params
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  // Validate URL params on mount
  useEffect(() => {
    if (!token || !email) {
      setApiError('Invalid password reset link. Please request a new one.');
    }
  }, [token, email]);

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
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePasswordStrength(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = `Password must contain ${passwordValidation.errors.join(', ')}`;
      }
    }

    if (!formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Password confirmation is required';
    } else if (formData.password !== formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for valid URL params
    if (!token || !email) {
      setApiError('Invalid password reset link. Please request a new one.');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      await resetPassword({
        email,
        token,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
      });
      
      setIsSubmitted(true);
      setSuccessMessage('Password reset successful! You can now login with your new password.');
    } catch (error) {
      // Handle API errors gracefully
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login', { 
      state: { message: 'Password reset successful! Please login with your new password.' }
    });
  };

  return (
    <div className="auth-container">
      <h1 className="auth-logo">{APP_NAME}</h1>
      <div className="auth-card">
        <div className="auth-header">
          <p className="auth-subtitle">RESET PASSWORD</p>
        </div>

        {isSubmitted && successMessage ? (
          <div className="auth-form">
            <div className="auth-success-message">
              {successMessage}
            </div>
            <Button
              type="button"
              variant="primary"
              size="large"
              className="auth-submit"
              onClick={handleGoToLogin}
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <p className="auth-description">
              Enter your new password below.
            </p>

            {apiError && (
              <div className="auth-error-message">
                {apiError}
              </div>
            )}

            <Input
              type="password"
              name="password"
              label="New Password"
              placeholder="Enter your new password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              disabled={!token || !email}
            />

            <Input
              type="password"
              name="passwordConfirmation"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              error={errors.passwordConfirmation}
              required
              disabled={!token || !email}
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="auth-submit"
              loading={loading}
              disabled={loading || !token || !email}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
