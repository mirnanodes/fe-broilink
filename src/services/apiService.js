const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000' + '/api';

const apiService = {
  getAuthToken() {
    return localStorage.getItem('auth_token');
  },

  setAuthToken(token) {
    localStorage.setItem('auth_token', token);
  },

  removeAuthToken() {
    localStorage.removeItem('auth_token');
  },

  async request(endpoint, options = {}) {
    const token = this.getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.removeAuthToken();
          window.location.href = '/login';
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // TODO: Add specific API methods for your app
  auth: {
    async login(credentials) {
      const response = await apiService.post('/login', credentials);
      if (response.token) {
        apiService.setAuthToken(response.token);
      }
      return response;
    },

    async logout() {
      await apiService.post('/logout');
      apiService.removeAuthToken();
    },

    async getProfile() {
      return apiService.get('/user/profile');
    },

    async updateProfile(data) {
      return apiService.put('/user/profile', data);
    },
  },

  // TODO: Add methods for Admin endpoints
  admin: {
    async getUsers() {
      return apiService.get('/admin/users');
    },

    async createUser(userData) {
      return apiService.post('/admin/users', userData);
    },

    async updateUser(userId, userData) {
      return apiService.put(`/admin/users/${userId}`, userData);
    },

    async deleteUser(userId) {
      return apiService.delete(`/admin/users/${userId}`);
    },

    async getFarms() {
      return apiService.get('/admin/farms');
    },

    async createFarm(farmData) {
      return apiService.post('/admin/farms', farmData);
    },

    async updateFarm(farmId, farmData) {
      return apiService.put(`/admin/farms/${farmId}`, farmData);
    },

    async deleteFarm(farmId) {
      return apiService.delete(`/admin/farms/${farmId}`);
    },

    async assignPeternak(farmId, peternakId) {
      return apiService.put(`/admin/farms/${farmId}/assign-peternak`, { peternak_id: peternakId });
    },

    async getRequests() {
      return apiService.get('/admin/requests');
    },
  },

  // TODO: Add methods for Owner endpoints
  owner: {
    async getDashboard() {
      return apiService.get('/owner/dashboard');
    },

    async getIotData(farmId) {
      return apiService.get(`/owner/monitoring/iot-data/${farmId}`);
    },

    async getManualData(farmId) {
      return apiService.get(`/owner/monitoring/manual-data/${farmId}`);
    },

    async getIotHistory(farmId) {
      return apiService.get(`/owner/analysis/history/iot/${farmId}`);
    },

    async getManualHistory(farmId) {
      return apiService.get(`/owner/analysis/history/manual/${farmId}`);
    },

    async submitRequest(requestData) {
      return apiService.post('/owner/requests', requestData);
    },
  },

  // TODO: Add methods for Peternak endpoints
  peternak: {
    async getDashboard() {
      return apiService.get('/peternak/dashboard');
    },

    async getStatusKandang(farmId) {
      return apiService.get(`/peternak/status-kandang/${farmId}`);
    },

    async submitManualData(data) {
      return apiService.post('/peternak/input/manual-data', data);
    },

    async updateManualData(id, data) {
      return apiService.put(`/peternak/input/manual-data/${id}`, data);
    },

    async getDailyInput(farmId, date) {
      return apiService.get(`/peternak/input/manual-data/${farmId}/${date}`);
    },

    async getIotGraph(farmId) {
      return apiService.get(`/peternak/grafik/iot/${farmId}`);
    },

    async getManualGraph(farmId) {
      return apiService.get(`/peternak/grafik/manual/${farmId}`);
    },
  },

  // TODO: Public endpoints
  public: {
    async submitGuestRequest(requestData) {
      return apiService.post('/requests/submit', requestData);
    },
  },
};

export default apiService;
