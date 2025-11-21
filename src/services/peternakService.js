import axiosInstance from '../utils/axios';

const peternakService = {
  /**
   * Get peternak dashboard
   * @returns {Promise} Current sensor data + 7 days summary
   */
  getDashboard: () => {
    return axiosInstance.get('/peternak/dashboard');
  },

  /**
   * Submit daily report
   * @param {Object} data - Report data {konsumsi_pakan, konsumsi_air, rata_rata_bobot, jumlah_kematian}
   * @returns {Promise} Success message
   */
  submitReport: (data) => {
    return axiosInstance.post('/peternak/reports', data);
  },

  /**
   * Get peternak profile
   * @returns {Promise} User data + owner name
   */
  getProfile: () => {
    return axiosInstance.get('/peternak/profile');
  },

  /**
   * Update profile (email only, phone requires OTP)
   * @param {Object} data - Profile data {email, phone_number}
   * @returns {Promise} Updated profile or OTP required message
   */
  updateProfile: (data) => {
    return axiosInstance.put('/peternak/profile', data);
  },

  /**
   * Upload profile photo
   * @param {File} file - Image file (jpg/png)
   * @returns {Promise} Updated profile pic URL
   */
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('photo', file);

    return axiosInstance.post('/peternak/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Send OTP to old phone number
   * @param {string} newPhone - New phone number
   * @returns {Promise} Success message
   */
  sendOtp: (newPhone) => {
    return axiosInstance.post('/peternak/otp/send', {
      new_phone_number: newPhone
    });
  },

  /**
   * Verify OTP and update phone
   * @param {string} otp - 6 digit OTP code
   * @param {string} newPhone - New phone number
   * @returns {Promise} Success message
   */
  verifyOtp: (otp, newPhone) => {
    return axiosInstance.post('/peternak/otp/verify', {
      otp,
      new_phone_number: newPhone
    });
  }
};

export default peternakService;
