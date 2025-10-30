import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import financeService from '../services/financeService';
import FinanceCard from '../components/FinanceCard';
import { useAuth } from '../context/AuthContext';
import './ProjectTopic.css';

const ProjectTopic = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    methodology: '',
    benefits: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchMethods();
  }, [categoryFilter, searchTerm]);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const params = {};
      if (categoryFilter) params.category = categoryFilter;
      if (searchTerm) params.search = searchTerm;
      
      const response = await financeService.getAllFinanceMethods(params);
      setMethods(response.data);
    } catch (error) {
      toast.error('Failed to fetch finance methods');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    setFormData({
      title: method.title,
      description: method.description,
      category: method.category,
      methodology: method.methodology,
      benefits: method.benefits?.join('\n') || '',
      imageUrl: method.imageUrl
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this finance method?')) {
      try {
        await financeService.deleteFinanceMethod(id);
        toast.success('Finance method deleted successfully');
        fetchMethods();
      } catch (error) {
        toast.error('Failed to delete finance method');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const benefitsArray = formData.benefits
      .split('\n')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    const methodData = {
      ...formData,
      benefits: benefitsArray
    };

    try {
      if (editingMethod) {
        await financeService.updateFinanceMethod(editingMethod._id, methodData);
        toast.success('Finance method updated successfully');
      } else {
        await financeService.createFinanceMethod(methodData);
        toast.success('Finance method created successfully');
      }
      
      setShowModal(false);
      setEditingMethod(null);
      resetForm();
      fetchMethods();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      methodology: '',
      benefits: '',
      imageUrl: ''
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingMethod(null);
    resetForm();
  };

  return (
    <div className="project-topic-page">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="topic-hero">
        <h1>Finance Management Methods</h1>
        <p>Explore proven strategies for managing your finances and expenditures</p>
      </div>

      <div className="topic-container">
        <div className="topic-controls">
          <div className="search-filter-group">
            <input
              type="text"
              placeholder="Search methods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="category-select"
            >
              <option value="">All Categories</option>
              <option value="Budgeting">Budgeting</option>
              <option value="Saving">Saving</option>
              <option value="Investment">Investment</option>
              <option value="Debt Management">Debt Management</option>
              <option value="Expense Tracking">Expense Tracking</option>
            </select>
          </div>

          {isAdmin() && (
            <button
              onClick={() => setShowModal(true)}
              className="add-method-btn"
            >
              + Add New Method
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : methods.length === 0 ? (
          <div className="no-results">
            <p>No finance methods found. {isAdmin() && 'Click "Add New Method" to create one.'}</p>
          </div>
        ) : (
          <div className="methods-grid">
            {methods.map((method) => (
              <FinanceCard
                key={method._id}
                method={method}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingMethod ? 'Edit Finance Method' : 'Add New Finance Method'}</h2>
              <button onClick={handleModalClose} className="modal-close">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Budgeting">Budgeting</option>
                  <option value="Saving">Saving</option>
                  <option value="Investment">Investment</option>
                  <option value="Debt Management">Debt Management</option>
                  <option value="Expense Tracking">Expense Tracking</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Methodology *</label>
                <textarea
                  value={formData.methodology}
                  onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Benefits (one per line)</label>
                <textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  rows="4"
                  placeholder="Enter each benefit on a new line"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleModalClose} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingMethod ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTopic;
