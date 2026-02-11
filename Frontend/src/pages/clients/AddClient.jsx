import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useClient } from '../../hooks/useClients';
import {
  BUSINESS_TYPES,
  DESIGNATION_ROLES,
  STATES,
  COUNTRIES,
  PAYMENT_TERMS,
  CURRENCIES,
  TAX_PERCENTAGES,
  CLIENT_CATEGORIES,
} from '../../utils/constants';
import './Clients.css';

const AddClient = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Use the client hook for API integration
  const { 
    create, 
    saving, 
    error: hookError 
  } = useClient();
  
  const [formData, setFormData] = useState({
    // Customer Type
    customerType: 'Commercial',
    // Basic Business Information (Commercial)
    businessName: '',
    businessType: '',
    industry: '',
    businessRegistrationNumber: '',
    // Primary Contact Information (Commercial)
    contactPersonName: '',
    designationRole: '',
    emailAddress: '',
    mobileNumber: '',
    alternateMobileNumber: '',
    // Business Address (Commercial)
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    pinZipcode: '',
    // Billing & Financial Details (Commercial)
    billingName: '',
    sameAsBillingAddress: false,
    paymentTerm: '',
    preferredCurrency: '',
    taxPercentage: '',
    // Additional Business Details (Commercial)
    websiteUrl: '',
    uploadLogo: null,
    clientCategory: '',
    notesRemark: '',
    // Personal Details (Residential)
    firstName: '',
    lastName: '',
    address: '',
    // Availability Schedule (Both)
    availableDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    serviceType: '',
    clientStatus: 'Active',
    preferredStartTime: '',
    preferredEndTime: '',
    hasLunchBreak: false,
    activeSchedule: false,
    availabilityNotes: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    // Handle availableDays checkboxes
    if (name.startsWith('availableDays.')) {
      const day = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        availableDays: {
          ...prev.availableDays,
          [day]: checked,
        },
      }));
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
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

    if (formData.customerType === 'Commercial') {
      // Commercial validation
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }

      if (!formData.businessType) {
        newErrors.businessType = 'Business type is required';
      }

      if (!formData.contactPersonName.trim()) {
        newErrors.contactPersonName = 'Contact person name is required';
      }

      if (!formData.emailAddress.trim()) {
        newErrors.emailAddress = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
        newErrors.emailAddress = 'Please enter a valid email address';
      }

      if (!formData.mobileNumber.trim()) {
        newErrors.mobileNumber = 'Mobile number is required';
      }

      if (!formData.addressLine1.trim()) {
        newErrors.addressLine1 = 'Address line 1 is required';
      }
    } else {
      // Residential validation
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }

      if (formData.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
        newErrors.emailAddress = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, createQuote = false) => {
    e.preventDefault();

    if (!validateForm()) return;

    setApiError(null);
    setSuccessMessage(null);

    try {
      // Prepare client data for API
      const clientData = {
        customerType: formData.customerType,
        // Commercial fields
        businessName: formData.businessName,
        businessType: formData.businessType,
        industry: formData.industry,
        businessRegistrationNumber: formData.businessRegistrationNumber,
        contactPersonName: formData.contactPersonName,
        designationRole: formData.designationRole,
        emailAddress: formData.emailAddress,
        mobileNumber: formData.mobileNumber,
        alternateMobileNumber: formData.alternateMobileNumber,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pinZipcode: formData.pinZipcode,
        billingName: formData.billingName,
        sameAsBillingAddress: formData.sameAsBillingAddress,
        paymentTerm: formData.paymentTerm,
        preferredCurrency: formData.preferredCurrency,
        taxPercentage: formData.taxPercentage,
        websiteUrl: formData.websiteUrl,
        clientCategory: formData.clientCategory,
        notesRemark: formData.notesRemark,
        // Residential fields
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        // Availability Schedule (both)
        availableDays: formData.availableDays,
        serviceType: formData.serviceType,
        clientStatus: formData.clientStatus,
        preferredStartTime: formData.preferredStartTime,
        preferredEndTime: formData.preferredEndTime,
        hasLunchBreak: formData.hasLunchBreak,
        activeSchedule: formData.activeSchedule,
        availabilityNotes: formData.availabilityNotes,
      };

      // Call the API to create the client
      const response = await create(clientData);
      
      if (response && response.client) {
        const newClient = response.client;
        setSuccessMessage('Client created successfully!');
        
        // Navigate after a brief delay to show success message
        setTimeout(() => {
          if (createQuote) {
            navigate('/quotes/create', { state: { clientId: newClient.id } });
          } else {
            navigate('/clients');
          }
        }, 1000);
      }
    } catch (err) {
      // Handle validation errors from API
      if (err.errors && typeof err.errors === 'object') {
        // Map API field names (snake_case) to form field names (camelCase)
        const fieldMapping = {
          business_name: 'businessName',
          business_type: 'businessType',
          industry: 'industry',
          business_registration_number: 'businessRegistrationNumber',
          contact_person_name: 'contactPersonName',
          designation_role: 'designationRole',
          email: 'emailAddress',
          mobile_number: 'mobileNumber',
          alternate_mobile_number: 'alternateMobileNumber',
          address_line_1: 'addressLine1',
          address_line_2: 'addressLine2',
          city: 'city',
          state: 'state',
          country: 'country',
          pin_zipcode: 'pinZipcode',
          billing_name: 'billingName',
          same_as_billing_address: 'sameAsBillingAddress',
          payment_term: 'paymentTerm',
          preferred_currency: 'preferredCurrency',
          tax_percentage: 'taxPercentage',
          website_url: 'websiteUrl',
          client_category: 'clientCategory',
          notes_remark: 'notesRemark',
          status: 'clientStatus',
        };

        const fieldErrors = {};
        Object.entries(err.errors).forEach(([apiField, errorMessages]) => {
          const formField = fieldMapping[apiField] || apiField;
          // API might return array of errors or single string
          fieldErrors[formField] = Array.isArray(errorMessages) 
            ? errorMessages[0] 
            : errorMessages;
        });
        
        setErrors(fieldErrors);
        setApiError(err.message || 'Please fix the highlighted errors below.');
      } else {
        setApiError(err.message || 'Failed to create client. Please try again.');
      }
      console.error('Error creating client:', err);
    }
  };

  const handleCancel = () => {
    navigate('/clients');
  };

  return (
    <div className="add-client-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <span className="breadcrumb-text">
          <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
          {' / '}
          <Link to="/clients" className="breadcrumb-link">Client</Link>
          {' / '}
          <span className="breadcrumb-current">New Client</span>
        </span>
      </div>

      {/* Page Header */}
      <div className="page-header-section">
        <div className="page-header-left">
          <h1 className="page-main-title">Add New Customer</h1>
          <p className="page-subtitle">Add a new customer by filling in their details below.</p>
        </div>
        <div className="page-header-right">
          <span className="choose-label">Choose Any One:</span>
          <div className="customer-type-toggle">
            <button
              type="button"
              className={`type-btn ${formData.customerType === 'Commercial' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, customerType: 'Commercial' }))}
            >
              <span>Commercial</span>
              <span className={`radio-indicator ${formData.customerType === 'Commercial' ? 'selected' : ''}`}></span>
            </button>
            <button
              type="button"
              className={`type-btn ${formData.customerType === 'Residential' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, customerType: 'Residential' }))}
            >
              <span>Residential</span>
              <span className={`radio-indicator ${formData.customerType === 'Residential' ? 'selected' : ''}`}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message-banner">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" fill="#DCFCE7"/>
            <path d="M6 10L9 13L14 7" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {(apiError || hookError) && (
        <div className="error-message-banner">
          <p>{apiError || hookError}</p>
          <button onClick={() => setApiError(null)} className="dismiss-btn">Dismiss</button>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)}>
        {/* Commercial Sections */}
        {formData.customerType === 'Commercial' && (
          <>
            {/* Section 1: Basic Business Information */}
            <div className="form-section-card">
              <div className="section-header-row">
                <div className="section-number">1</div>
                <h2 className="section-title-text">Basic Business Information</h2>
              </div>
          <div className="form-fields-container">
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">
                  Business Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={`field-input ${errors.businessName ? 'error' : ''}`}
                />
                {errors.businessName && <span className="error-text">{errors.businessName}</span>}
              </div>
              <div className="form-field">
                <label className="field-label">
                  Business Type<span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className={`field-select ${errors.businessType ? 'error' : ''}`}
                  >
                    <option value="">Select</option>
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                {errors.businessType && <span className="error-text">{errors.businessType}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Industry</label>
                <input
                  type="text"
                  name="industry"
                  placeholder=""
                  value={formData.industry}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>
              <div className="form-field">
                <label className="field-label">Business Registration Number</label>
                <input
                  type="text"
                  name="businessRegistrationNumber"
                  placeholder=""
                  value={formData.businessRegistrationNumber}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Primary Contact Information */}
        <div className="form-section-card">
          <div className="section-header-row">
            <div className="section-number">2</div>
            <h2 className="section-title-text">Primary Contact Information</h2>
          </div>
          <div className="form-fields-container">
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">
                  Contact Person Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="contactPersonName"
                  placeholder=""
                  value={formData.contactPersonName}
                  onChange={handleChange}
                  className={`field-input ${errors.contactPersonName ? 'error' : ''}`}
                />
                {errors.contactPersonName && <span className="error-text">{errors.contactPersonName}</span>}
              </div>
              <div className="form-field">
                <label className="field-label">Designation/Role</label>
                <div className="select-wrapper">
                  <select
                    name="designationRole"
                    value={formData.designationRole}
                    onChange={handleChange}
                    className="field-select"
                  >
                    <option value="">Select</option>
                    {DESIGNATION_ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Email Address</label>
                <input
                  type="email"
                  name="emailAddress"
                  placeholder=""
                  value={formData.emailAddress}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>
              <div className="form-field">
                <label className="field-label">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder=""
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Alternate Mobile Number</label>
                <input
                  type="tel"
                  name="alternateMobileNumber"
                  placeholder=""
                  value={formData.alternateMobileNumber}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>
              <div className="form-field"></div>
            </div>
          </div>
        </div>

        {/* Section 3: Business Address */}
        <div className="form-section-card">
          <div className="section-header-row">
            <div className="section-number">3</div>
            <h2 className="section-title-text">Business Address</h2>
          </div>
          <div className="form-fields-container">
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">
                  Address Line 1<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  placeholder=""
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className={`field-input ${errors.addressLine1 ? 'error' : ''}`}
                />
                {errors.addressLine1 && <span className="error-text">{errors.addressLine1}</span>}
              </div>
              <div className="form-field">
                <label className="field-label">
                  Address Line 2<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  placeholder=""
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className={`field-input ${errors.addressLine2 ? 'error' : ''}`}
                />
                {errors.addressLine2 && <span className="error-text">{errors.addressLine2}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder=""
                  value={formData.city}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>
              <div className="form-field">
                <label className="field-label">State</label>
                <div className="select-wrapper">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="field-select"
                  >
                    <option value="">Select</option>
                    {STATES.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Country</label>
                <div className="select-wrapper">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="field-select"
                  >
                    <option value="">Select</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="form-field">
                <label className="field-label">Pin/Zipcode</label>
                <input
                  type="text"
                  name="pinZipcode"
                  placeholder=""
                  value={formData.pinZipcode}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Billing & Financial Details */}
        <div className="form-section-card">
          <div className="section-header-row">
            <div className="section-number">4</div>
            <h2 className="section-title-text">Billing & Financial Details</h2>
          </div>
          <div className="form-fields-container">
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Billing Name</label>
                <input
                  type="text"
                  name="billingName"
                  placeholder=""
                  value={formData.billingName}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>
              <div className="form-field checkbox-field">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="sameAsBillingAddress"
                    checked={formData.sameAsBillingAddress}
                    onChange={handleChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">Same as billing address</span>
                </label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Payment Term</label>
                <div className="select-wrapper">
                  <select
                    name="paymentTerm"
                    value={formData.paymentTerm}
                    onChange={handleChange}
                    className="field-select"
                  >
                    <option value="">Select</option>
                    {PAYMENT_TERMS.map((term) => (
                      <option key={term.value} value={term.value}>
                        {term.label}
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="form-field">
                <label className="field-label">Preferred Currency</label>
                <div className="select-wrapper">
                  <select
                    name="preferredCurrency"
                    value={formData.preferredCurrency}
                    onChange={handleChange}
                    className="field-select"
                  >
                    <option value="">Select</option>
                    {CURRENCIES.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Tax Percentage</label>
                <div className="select-wrapper">
                  <select
                    name="taxPercentage"
                    value={formData.taxPercentage}
                    onChange={handleChange}
                    className="field-select"
                  >
                    <option value="">Select</option>
                    {TAX_PERCENTAGES.map((tax) => (
                      <option key={tax.value} value={tax.value}>
                        {tax.label}
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="form-field"></div>
            </div>
          </div>
        </div>

        {/* Section 5: Additional Business Details */}
        <div className="form-section-card">
          <div className="section-header-row">
            <div className="section-number">5</div>
            <h2 className="section-title-text">Additional Business details</h2>
          </div>
          <div className="form-fields-container">
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Website URL</label>
                <div className="select-wrapper">
                  <select
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className="field-select"
                  >
                    <option value="">Select</option>
                    <option value="https://">https://</option>
                    <option value="http://">http://</option>
                  </select>
                  <span className="select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="form-field">
                <label className="field-label">Upload Logo</label>
                <div className="upload-field">
                  <input
                    type="file"
                    name="uploadLogo"
                    id="uploadLogo"
                    accept="image/*"
                    onChange={handleChange}
                    className="file-input"
                  />
                  <label htmlFor="uploadLogo" className="upload-button">
                    Upload
                  </label>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Client Category</label>
                <div className="select-wrapper">
                  <select
                    name="clientCategory"
                    value={formData.clientCategory}
                    onChange={handleChange}
                    className="field-select"
                  >
                    <option value="">Select</option>
                    {CLIENT_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="form-field">
                <label className="field-label">Notes & Remark</label>
                <input
                  type="text"
                  name="notesRemark"
                  placeholder=""
                  value={formData.notesRemark}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Residential Section: Personal Details */}
        {formData.customerType === 'Residential' && (
          <div className="form-section-card">
            <div className="section-header-row">
              <div className="section-number">1</div>
              <h2 className="section-title-text">Personal Details</h2>
            </div>
            <div className="form-fields-container">
              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">
                    First Name<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder=""
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`field-input ${errors.firstName ? 'error' : ''}`}
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>
                <div className="form-field">
                  <label className="field-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder=""
                    value={formData.lastName}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">Email Address</label>
                  <input
                    type="email"
                    name="emailAddress"
                    placeholder=""
                    value={formData.emailAddress}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder=""
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
              </div>
              <div className="form-row full-width-row">
                <div className="form-field full-width">
                  <label className="field-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder=""
                    value={formData.address}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 6: Availability Schedule (for Commercial) */}
        {formData.customerType === 'Commercial' && (
          <div className="form-section-card">
            <div className="section-header-row">
              <div className="section-number">6</div>
              <h2 className="section-title-text">Availability Schedule</h2>
            </div>
            <div className="form-fields-container">
              {/* Row 1: Available Days + Service Type */}
              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">Available Days</label>
                  <div className="available-days-container">
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        name="availableDays.monday"
                        checked={formData.availableDays.monday}
                        onChange={handleChange}
                      />
                      <span>Monday</span>
                    </label>
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        name="availableDays.tuesday"
                        checked={formData.availableDays.tuesday}
                        onChange={handleChange}
                      />
                      <span>Tuesday</span>
                    </label>
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        name="availableDays.wednesday"
                        checked={formData.availableDays.wednesday}
                        onChange={handleChange}
                      />
                      <span>Wednesday</span>
                    </label>
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        name="availableDays.thursday"
                        checked={formData.availableDays.thursday}
                        onChange={handleChange}
                      />
                      <span>Thursday</span>
                    </label>
                  </div>
                  <div className="available-days-container">
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        name="availableDays.friday"
                        checked={formData.availableDays.friday}
                        onChange={handleChange}
                      />
                      <span>Friday</span>
                    </label>
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        name="availableDays.saturday"
                        checked={formData.availableDays.saturday}
                        onChange={handleChange}
                      />
                      <span>Saturday</span>
                    </label>
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        name="availableDays.sunday"
                        checked={formData.availableDays.sunday}
                        onChange={handleChange}
                      />
                      <span>Sunday</span>
                    </label>
                  </div>
                </div>
                <div className="form-field">
                  <label className="field-label">Service Type</label>
                  <div className="select-wrapper">
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="field-select"
                    >
                      <option value="">Service Type</option>
                      <option value="one-time">One-Time</option>
                      <option value="recurring">Recurring</option>
                      <option value="on-demand">On-Demand</option>
                    </select>
                    <span className="select-arrow">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              {/* Row 2: Preferred Start Time + Preferred End Time */}
              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">Preferred Start Time</label>
                  <input
                    type="text"
                    name="preferredStartTime"
                    placeholder=""
                    value={formData.preferredStartTime}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">Preferred End Time</label>
                  <input
                    type="text"
                    name="preferredEndTime"
                    placeholder=""
                    value={formData.preferredEndTime}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
              </div>
              {/* Row 3: Has Lunch Break checkbox alone */}
              <div className="form-row">
                <div className="form-field checkbox-field">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="hasLunchBreak"
                      checked={formData.hasLunchBreak}
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Has Lunch Break</span>
                  </label>
                </div>
                <div className="form-field"></div>
              </div>
              {/* Row 4: Availability Notes + Active Schedule */}
              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">Availability Notes</label>
                  <input
                    type="text"
                    name="availabilityNotes"
                    placeholder=""
                    value={formData.availabilityNotes}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
                <div className="form-field checkbox-field align-center">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="activeSchedule"
                      checked={formData.activeSchedule}
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Active Schedule</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Availability Schedule (for Residential) */}
        {formData.customerType === 'Residential' && (
          <div className="form-section-card">
            <div className="section-header-row">
              <div className="section-number">2</div>
              <h2 className="section-title-text">Availability Schedule</h2>
            </div>
            <div className="form-fields-container">
              {/* Row 1: Available Days + Service Type */}
              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">Available Days</label>
                  <div className="available-days-container">
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        name="availableDays.monday"
                        checked={formData.availableDays.monday}
                        onChange={handleChange}
                      />
                      <span>Monday</span>
                    </label>
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        name="availableDays.tuesday"
                        checked={formData.availableDays.tuesday}
                        onChange={handleChange}
                      />
                      <span>Tuesday</span>
                    </label>
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        name="availableDays.wednesday"
                        checked={formData.availableDays.wednesday}
                        onChange={handleChange}
                      />
                      <span>Wednesday</span>
                    </label>
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        name="availableDays.thursday"
                        checked={formData.availableDays.thursday}
                        onChange={handleChange}
                      />
                      <span>Thursday</span>
                    </label>
                  </div>
                  <div className="available-days-container">
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        name="availableDays.friday"
                        checked={formData.availableDays.friday}
                        onChange={handleChange}
                      />
                      <span>Friday</span>
                    </label>
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        name="availableDays.saturday"
                        checked={formData.availableDays.saturday}
                        onChange={handleChange}
                      />
                      <span>Saturday</span>
                    </label>
                    <label className="day-checkbox">
                      <input
                        type="checkbox"
                        name="availableDays.sunday"
                        checked={formData.availableDays.sunday}
                        onChange={handleChange}
                      />
                      <span>Sunday</span>
                    </label>
                  </div>
                </div>
                <div className="form-field">
                  <label className="field-label">Service Type</label>
                  <div className="select-wrapper">
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="field-select"
                    >
                      <option value="">Service Type</option>
                      <option value="one-time">One-Time</option>
                      <option value="recurring">Recurring</option>
                      <option value="on-demand">On-Demand</option>
                    </select>
                    <span className="select-arrow">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              {/* Row 2: Preferred Start Time + Preferred End Time */}
              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">Preferred Start Time</label>
                  <input
                    type="text"
                    name="preferredStartTime"
                    placeholder=""
                    value={formData.preferredStartTime}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">Preferred End Time</label>
                  <input
                    type="text"
                    name="preferredEndTime"
                    placeholder=""
                    value={formData.preferredEndTime}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
              </div>
              {/* Row 3: Has Lunch Break checkbox alone */}
              <div className="form-row">
                <div className="form-field checkbox-field">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="hasLunchBreak"
                      checked={formData.hasLunchBreak}
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Has Lunch Break</span>
                  </label>
                </div>
                <div className="form-field"></div>
              </div>
              {/* Row 4: Availability Notes + Active Schedule */}
              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">Availability Notes</label>
                  <input
                    type="text"
                    name="availabilityNotes"
                    placeholder=""
                    value={formData.availabilityNotes}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
                <div className="form-field checkbox-field align-center">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="activeSchedule"
                      checked={formData.activeSchedule}
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Active Schedule</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="form-actions-bar">
          <button type="button" className="btn-cancel" onClick={handleCancel} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? (
              <>
                <span className="btn-spinner"></span>
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
          <button
            type="button"
            className="btn-save-create"
            onClick={(e) => handleSubmit(e, true)}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save & Create Quote'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;