import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token || '';
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL
});

// Submit contact form
const submitContact = async (contactData) => {
  const response = await axiosInstance.post('/contact', contactData);
  return response.data;
};

// Get all contacts (Admin only)
const getAllContacts = async () => {
  const response = await axiosInstance.get('/contact', {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

// Update contact status (Admin only)
const updateContactStatus = async (id, status) => {
  const response = await axiosInstance.put(`/contact/${id}`, { status }, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

// Delete contact (Admin only)
const deleteContact = async (id) => {
  const response = await axiosInstance.delete(`/contact/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

const contactService = {
  submitContact,
  getAllContacts,
  updateContactStatus,
  deleteContact
};

export default contactService;
