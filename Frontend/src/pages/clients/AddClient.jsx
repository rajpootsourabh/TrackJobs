import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Clients.css';

const AddClient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Business Information
    businessName: '',
    businessType: '',
    industry: '',
    businessRegistrationNumber: '',
    // Primary Contact Information
    contactPersonName: '',
    designationRole: '',
    emailAddress: '',
    mobileNumber: '',
    alternateMobileNumber: '',
    // Business Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    pinZipcode: '',
    // Billing & Financial Details
    billingName: '',
    sameAsBillingAddress: false,
    paymentTerm: '',
    preferredCurrency: '',
    taxPercentage: '',
    // Additional Business Details
    websiteUrl: '',
    uploadLogo: null,
    clientCategory: '',
    notesRemark: '',
    // Status & Actions
    clientStatus: 'Active',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
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

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required';
    }

    if (!formData.contactPersonName.trim()) {
      newErrors.contactPersonName = 'Contact person name is required';
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address line 1 is required';
    }

    if (!formData.addressLine2.trim()) {
      newErrors.addressLine2 = 'Address line 2 is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, createQuote = false) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    console.log('Add client form submitted:', formData);

    setTimeout(() => {
      setLoading(false);
      if (createQuote) {
        navigate('/quotes/create');
      } else {
        navigate('/clients');
      }
    }, 1000);
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
        <h1 className="page-main-title">New Client</h1>
        <p className="page-subtitle">Add a new client by filling in their details below.</p>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)}>
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
                    <option value="sole_proprietorship">Sole Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="llc">LLC</option>
                    <option value="corporation">Corporation</option>
                    <option value="nonprofit">Non-Profit</option>
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
                    <option value="owner">Owner</option>
                    <option value="manager">Manager</option>
                    <option value="director">Director</option>
                    <option value="accountant">Accountant</option>
                    <option value="other">Other</option>
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
                    <option value="maharashtra">Maharashtra</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="delhi">Delhi</option>
                    <option value="tamil_nadu">Tamil Nadu</option>
                    <option value="gujarat">Gujarat</option>
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
                    <option value="india">India</option>
                    <option value="usa">USA</option>
                    <option value="uk">UK</option>
                    <option value="australia">Australia</option>
                    <option value="canada">Canada</option>
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
                    <option value="net_15">Net 15</option>
                    <option value="net_30">Net 30</option>
                    <option value="net_45">Net 45</option>
                    <option value="net_60">Net 60</option>
                    <option value="due_on_receipt">Due on Receipt</option>
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
                    <option value="inr">INR - Indian Rupee</option>
                    <option value="usd">USD - US Dollar</option>
                    <option value="eur">EUR - Euro</option>
                    <option value="gbp">GBP - British Pound</option>
                    <option value="aud">AUD - Australian Dollar</option>
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
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
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
                    <option value="https">https://</option>
                    <option value="http">http://</option>
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
                    <option value="regular">Regular</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                    <option value="new">New</option>
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

        {/* Section 6: Status & Actions */}
        <div className="form-section-card">
          <div className="section-header-row">
            <div className="section-number">6</div>
            <h2 className="section-title-text">Status & Actions</h2>
          </div>
          <div className="form-fields-container">
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Client Status</label>
                <div className="select-wrapper">
                  <select
                    name="clientStatus"
                    value={formData.clientStatus}
                    onChange={handleChange}
                    className="field-select"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Lead">Lead</option>
                    <option value="Prospect">Prospect</option>
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

        {/* Action Buttons */}
        <div className="form-actions-bar">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            className="btn-save-create"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
          >
            Save & Create Quote
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
