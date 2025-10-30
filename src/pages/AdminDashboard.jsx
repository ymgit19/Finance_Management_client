import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import contactService from '../services/contactService';
import financeService from '../services/financeService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [contacts, setContacts] = useState([]);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContacts: 0,
    pendingContacts: 0,
    totalMethods: 0
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'contacts') {
        const response = await contactService.getAllContacts();
        setContacts(response.data);
        setStats(prev => ({
          ...prev,
          totalContacts: response.data.length,
          pendingContacts: response.data.filter(c => c.status === 'pending').length
        }));
      } else {
        const response = await financeService.getAllFinanceMethods();
        setMethods(response.data);
        setStats(prev => ({
          ...prev,
          totalMethods: response.data.length
        }));
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await contactService.updateContactStatus(id, status);
      toast.success('Contact status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await contactService.deleteContact(id);
        toast.success('Inquiry deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete inquiry');
      }
    }
  };

  const handleDeleteMethod = async (id) => {
    if (window.confirm('Are you sure you want to delete this finance method?')) {
      try {
        await financeService.deleteFinanceMethod(id);
        toast.success('Finance method deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete method');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage contacts and finance methods</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-info">
            <h3>{stats.totalContacts}</h3>
            <p>Total Inquiries</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingContacts}</h3>
            <p>Pending</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💡</div>
          <div className="stat-info">
            <h3>{stats.totalMethods}</h3>
            <p>Finance Methods</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contact Inquiries
        </button>
        <button
          className={`tab-btn ${activeTab === 'methods' ? 'active' : ''}`}
          onClick={() => setActiveTab('methods')}
        >
          Finance Methods
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : activeTab === 'contacts' ? (
          <div className="contacts-list">
            {contacts.length === 0 ? (
              <p className="no-data">No contact inquiries yet.</p>
            ) : (
              contacts.map((contact) => (
                <div key={contact._id} className="contact-item">
                  <div className="contact-header">
                    <div>
                      <h3>{contact.name}</h3>
                      <p className="contact-email">{contact.email}</p>
                    </div>
                    <span className={`status-badge ${contact.status}`}>
                      {contact.status}
                    </span>
                  </div>
                  
                  <div className="contact-details">
                    <p><strong>Type:</strong> {contact.inquiryType}</p>
                    <p><strong>Subject:</strong> {contact.subject}</p>
                    <p><strong>Message:</strong> {contact.message}</p>
                    <p className="contact-date">
                      <strong>Submitted:</strong> {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="contact-actions">
                    {contact.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(contact._id, 'resolved')}
                        className="btn-resolve"
                      >
                        Mark as Resolved
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteContact(contact._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="methods-list">
            {methods.length === 0 ? (
              <p className="no-data">No finance methods yet.</p>
            ) : (
              <div className="methods-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {methods.map((method) => (
                      <tr key={method._id}>
                        <td>{method.title}</td>
                        <td>
                          <span className="category-badge">{method.category}</span>
                        </td>
                        <td className="description-cell">{method.description}</td>
                        <td>{new Date(method.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteMethod(method._id)}
                            className="btn-delete-small"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
