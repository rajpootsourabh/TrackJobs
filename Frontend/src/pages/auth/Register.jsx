import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { APP_NAME } from '../../utils/constants';
import { register } from '../../services/authService';
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

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    websiteName: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    passwordConfirmation: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    // Clear API error when user types
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.websiteName.trim()) {
      newErrors.websiteName = 'Website name is required';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    }

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

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      // Prepare data for API (convert to snake_case)
      const userData = {
        business_name: formData.businessName,
        website_name: formData.websiteName,
        full_name: formData.fullName,
        email: formData.email,
        mobile_number: formData.mobileNumber,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
        terms_accepted: formData.agreeToTerms,
      };

      await register(userData);
      
      // Redirect to login on success
      navigate('/login', { 
        state: { message: 'Registration successful! Please login to continue.' }
      });
    } catch (error) {
      // Handle validation errors from backend
      if (error.errors) {
        const backendErrors = error.errors;
        const mappedErrors = {};
        
        // Map backend field names to frontend field names
        const fieldMapping = {
          business_name: 'businessName',
          website_name: 'websiteName',
          full_name: 'fullName',
          email: 'email',
          mobile_number: 'mobileNumber',
          password: 'password',
          password_confirmation: 'passwordConfirmation',
          terms_accepted: 'agreeToTerms',
        };

        Object.keys(backendErrors).forEach((key) => {
          const frontendKey = fieldMapping[key] || key;
          mappedErrors[frontendKey] = Array.isArray(backendErrors[key]) 
            ? backendErrors[key][0] 
            : backendErrors[key];
        });

        setErrors(mappedErrors);
      } else {
        // Show general error message
        setApiError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-logo">{APP_NAME}</h1>
      <div className="auth-card auth-card-register">
        <div className="auth-header">
          <p className="auth-subtitle">SIGN UP</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {apiError && (
            <div className="auth-error-message">
              {apiError}
            </div>
          )}

          <Input
            type="text"
            name="businessName"
            label="Business Name"
            placeholder="Enter your business name"
            value={formData.businessName}
            onChange={handleChange}
            error={errors.businessName}
            required
          />

          <Input
            type="text"
            name="websiteName"
            label="Website Name"
            placeholder="Enter your website name"
            value={formData.websiteName}
            onChange={handleChange}
            error={errors.websiteName}
            required
          />

          <Input
            type="text"
            name="fullName"
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />

          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            type="tel"
            name="mobileNumber"
            label="Mobile Number"
            placeholder="Enter your mobile number"
            value={formData.mobileNumber}
            onChange={handleChange}
            error={errors.mobileNumber}
            required
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Input
            type="password"
            name="passwordConfirmation"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.passwordConfirmation}
            onChange={handleChange}
            error={errors.passwordConfirmation}
            required
          />

          <div className="terms-checkbox-wrapper">
            <label className="terms-checkbox">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <span>I agree to the <Link to="/terms" className="auth-link">Terms & Conditions</Link></span>
            </label>
            {errors.agreeToTerms && (
              <span className="terms-error">{errors.agreeToTerms}</span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            className="auth-submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="auth-footer">
          if you already have an account?{' '}
          <Link to="/login" className="auth-link">
            Login Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
