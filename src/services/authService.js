import axiosInstance, { getCsrfCookie } from '../utils/axios';

const authService = {
  login: async (username, password) => {
    await getCsrfCookie();
    const response = await axiosInstance.post('/login', { username, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
