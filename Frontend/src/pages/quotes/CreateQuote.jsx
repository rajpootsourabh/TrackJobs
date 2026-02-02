import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { DUMMY_CLIENTS } from '../../utils/constants';
import './Quotes.css';

const CreateQuote = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    description: '',
    validUntil: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    notes: '',
  });
  const [errors, setErrors] = useState({});

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

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'quantity' || field === 'unitPrice' ? Number(value) : value;
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        items: newItems,
      }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + item.quantity * item.unitPrice;
    }, 0);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Please select a client';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Quote title is required';
    }

    if (!formData.validUntil) {
      newErrors.validUntil = 'Valid until date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Prepare data with total
    const quoteData = {
      ...formData,
      total: calculateTotal(),
    };

    console.log('Create quote form submitted:', quoteData);

    setTimeout(() => {
      setLoading(false);
      navigate('/quotes');
    }, 1000);
  };

  return (
    <div className="create-quote-page">
      <div className="page-header">
        <h1 className="page-title">Create Quote</h1>
        <Link to="/quotes">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="quote-form">
        <div className="form-section card">
          <h3 className="section-title">Quote Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Client <span className="required">*</span>
              </label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                className={`form-select ${errors.clientId ? 'input-error' : ''}`}
              >
                <option value="">Select a client</option>
                {DUMMY_CLIENTS.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.company}
                  </option>
                ))}
              </select>
              {errors.clientId && <span className="error-message">{errors.clientId}</span>}
            </div>

            <Input
              type="text"
              name="title"
              label="Quote Title"
              placeholder="Enter quote title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
            />

            <Input
              type="date"
              name="validUntil"
              label="Valid Until"
              value={formData.validUntil}
              onChange={handleChange}
              error={errors.validUntil}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              placeholder="Quote description..."
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows={3}
            />
          </div>
        </div>

        <div className="form-section card">
          <h3 className="section-title">Line Items</h3>
          <div className="items-table">
            <div className="items-header">
              <span>Description</span>
              <span>Quantity</span>
              <span>Unit Price</span>
              <span>Total</span>
              <span></span>
            </div>
            {formData.items.map((item, index) => (
              <div key={index} className="item-row">
                <input
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="item-input"
                />
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="item-input item-quantity"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  className="item-input item-price"
                />
                <span className="item-total">
                  ${(item.quantity * item.unitPrice).toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="remove-item-btn"
                  disabled={formData.items.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="small" onClick={addItem}>
            + Add Item
          </Button>

          <div className="quote-total">
            <span className="total-label">Total Amount:</span>
            <span className="total-value">${calculateTotal().toLocaleString()}</span>
          </div>
        </div>

        <div className="form-section card">
          <h3 className="section-title">Additional Notes</h3>
          <div className="form-group">
            <textarea
              name="notes"
              placeholder="Terms, conditions, or additional notes..."
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
              rows={4}
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={() => navigate('/quotes')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Create Quote
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuote;
