import axiosInstance from '../utils/axios';

const adminService = {
  /**
   * Get admin dashboard data
   * @returns {Promise} Dashboard summary and recent requests
   */
  getDashboard: () => {
    return axiosInstance.get('/api/admin/dashboard');
  },

  /**
   * Get all users (Owner & Peternak only)
   * @param {string} search - Search query for name or email
   * @returns {Promise} Users list
   */
  getUsers: (search = '') => {
    return axiosInstance.get('/api/admin/users', {
      params: { search }
    });
  },

  /**
   * Create new user
   * @param {Object} data - User data {role_id, username, email, password, name, phone_number}
   * @returns {Promise} Created user
   */
  createUser: (data) => {
    return axiosInstance.post('/api/admin/users', data);
  },

  /**
   * Update existing user
   * @param {number} id - User ID
   * @param {Object} data - Updated user data
   * @returns {Promise} Updated user
   */
  updateUser: (id, data) => {
    return axiosInstance.put(`/api/admin/users/${id}`, data);
  },

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise} Success message
   */
  deleteUser: (id) => {
    return axiosInstance.delete(`/api/admin/users/${id}`);
  },

  /**
   * Get all farms
   * @returns {Promise} Farms list
   */
  getFarms: () => {
    return axiosInstance.get('/api/admin/farms');
  },

  /**
   * Create new farm
   * @param {Object} data - Farm data {owner_id, farm_name, location, initial_population, initial_weight, farm_area}
   * @returns {Promise} Created farm
   */
  createFarm: (data) => {
    return axiosInstance.post('/api/admin/farms', data);
  },

  /**
   * Get farm configuration
   * @param {number} farmId - Farm ID
   * @returns {Promise} Farm config (EAV pattern)
   */
  getFarmConfig: (farmId) => {
    return axiosInstance.get(`/api/admin/farms/${farmId}/config`);
  },

  /**
   * Update farm configuration
   * @param {number} farmId - Farm ID
   * @param {Object} config - Configuration object
   * @returns {Promise} Updated config
   */
  updateFarmConfig: (farmId, config) => {
    return axiosInstance.put(`/api/admin/farms/${farmId}/config`, config);
  },

  /**
   * Reset farm config to default (first input)
   * @param {number} farmId - Farm ID
   * @returns {Promise} Success message
   */
  resetFarmConfig: (farmId) => {
    return axiosInstance.post(`/api/admin/farms/${farmId}/config/reset`);
  },

  /**
   * Get all request logs
   * @param {string} sort - Sort order: 'newest' or 'oldest'
   * @param {number} page - Page number (6 items per page)
   * @returns {Promise} Paginated requests
   */
  getRequests: (sort = 'newest', page = 1) => {
    return axiosInstance.get('/api/admin/requests', {
      params: { sort, page }
    });
  },

  /**
   * Update request status
   * @param {number} id - Request ID
   * @param {string} status - Status: 'menunggu', 'diproses', 'selesai'
   * @returns {Promise} Updated request
   */
  updateRequestStatus: (id, status) => {
    return axiosInstance.put(`/api/admin/requests/${id}/status`, { status });
  },

  /**
   * Get all owners (for dropdown)
   * @returns {Promise} Owners list
   */
  getOwners: () => {
    return axiosInstance.get('/api/admin/owners');
  },

  /**
   * Get peternaks assigned to owner
   * @param {number} ownerId - Owner user ID
   * @returns {Promise} Peternaks list
   */
  getPeternaks: (ownerId) => {
    return axiosInstance.get(`/api/admin/peternaks/${ownerId}`);
  }
};

export default adminService;
