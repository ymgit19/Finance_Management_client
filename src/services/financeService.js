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

// Get all finance methods
const getAllFinanceMethods = async (params = {}) => {
  const { category, search } = params;
  let url = '/finance-methods';
  const queryParams = new URLSearchParams();
  
  if (category) queryParams.append('category', category);
  if (search) queryParams.append('search', search);
  
  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }
  
  const response = await axiosInstance.get(url);
  return response.data;
};

// Get single finance method
const getFinanceMethodById = async (id) => {
  const response = await axiosInstance.get(`/finance-methods/${id}`);
  return response.data;
};

// Create finance method (Admin only)
const createFinanceMethod = async (methodData) => {
  const response = await axiosInstance.post('/finance-methods', methodData, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

// Update finance method (Admin only)
const updateFinanceMethod = async (id, methodData) => {
  const response = await axiosInstance.put(`/finance-methods/${id}`, methodData, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

// Delete finance method (Admin only)
const deleteFinanceMethod = async (id) => {
  const response = await axiosInstance.delete(`/finance-methods/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

const financeService = {
  getAllFinanceMethods,
  getFinanceMethodById,
  createFinanceMethod,
  updateFinanceMethod,
  deleteFinanceMethod
};

export default financeService;
