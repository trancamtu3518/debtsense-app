import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:3000/api'; // Android emulator
// const API_BASE_URL = 'http://localhost:3000/api'; // Web/iOS simulator
// const API_BASE_URL = 'http://your-local-ip:3000/api'; // Thay bằng IP máy bạn cho thiết bị thật

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Auth API
export const authApi = {
  registerEkyc: (data) => apiClient.post('/auth/register-ekyc', data),
  login: (data) => apiClient.post('/auth/login', data),
};

// Anxiety Scan API
export const scanApi = {
  getQuestions: () => apiClient.get('/scan/questions'),
  submitScan: (responses) => apiClient.post('/scan/submit', { responses }),
  getProfile: () => apiClient.get('/scan/profile'),
};

// Reframe API
export const reframeApi = {
  getDebtReframe: () => apiClient.get('/reframe/debt'),
  getSavingsReframe: () => apiClient.get('/reframe/savings'),
};

// Transactions API
export const transactionsApi = {
  getSummary: () => apiClient.get('/transactions/summary'),
  addManual: (data) => apiClient.post('/transactions/manual', data),
};

// Goals & Milestones
export const goalsApi = {
  getCurrentGoal: () => apiClient.get('/goals/current'),
  completeGoal: () => apiClient.post('/goals/complete'),
};

export const milestonesApi = {
  getAll: () => apiClient.get('/milestones/all'),
  getNext: () => apiClient.get('/milestones/next'),
};

export const nudgeApi = {
  getCurrent: () => apiClient.get('/nudge/current'),
  checkIn: (data) => apiClient.post('/nudge/checkin', data),
};

export default apiClient;
