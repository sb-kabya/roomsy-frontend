import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://roomsy-git-backend-sb-kabyas-projects.vercel.app';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/api/accounts/jwt/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/api/accounts/users/', data),
  activate: (uid, token) => api.post('/api/accounts/users/activation/', { uid, token }),
  login: (data) => api.post('/api/accounts/jwt/create/', data),
  logout: (refresh) => api.post('/api/accounts/logout/', { refresh }),
  getProfile: () => api.get('/api/accounts/profile/'),
  updateProfile: (data) => api.patch('/api/accounts/profile/', data),
  deposit: (amount) => api.post('/api/accounts/deposit/', { amount }),
  resetPasswordRequest: (email) => api.post('/api/accounts/users/reset_password/', { email }),
};

export const hotelAPI = {
  list: (params) => api.get('/api/hotels/', { params }),
  detail: (id) => api.get(`/api/hotels/${id}/`),
  rooms: (hotelId, params) => api.get(`/api/hotels/${hotelId}/rooms/`, { params }),
};

export const bookingAPI = {
  create: (data) => api.post('/api/bookings/create/', data),
  myBookings: () => api.get('/api/bookings/'),
  detail: (id) => api.get(`/api/bookings/${id}/`),
  cancel: (bookingId) => api.post(`/api/bookings/${bookingId}/cancel/`),
};

export const reviewAPI = {
  hotelReviews: (hotelId) => api.get(`/api/reviews/hotel/${hotelId}/`),
  create: (data) => api.post('/api/reviews/create/', data),
  // CORRECT
  myReviews: () => api.get('/api/reviews/my/'),
  update: (id, data) => api.patch(`/api/reviews/${id}/`, data),
  delete: (id) => api.delete(`/api/reviews/${id}/`),
};

export const dashboardAPI = {
  stats: () => api.get('/api/dashboard/'),
  trends: (days) => api.get('/api/dashboard/trends/', { params: { days } }),
};

export default api;
