import axiosInstance from '../utils/axios';
import { USE_MOCK_DATA, API_BASE_URL } from '../config/api';
import { mockOwnerData } from '../mocks/ownerData';

class OwnerService {
  async getDashboard() {
    if (USE_MOCK_DATA) {
      return { data: { success: true, data: mockOwnerData } };
    }
    try {
      return await axiosInstance.get('/api/owner/dashboard');
    } catch (error) {
      console.error('API error, using mock:', error);
      return { data: { success: true, data: mockOwnerData } };
    }
  }

  async getFarms() {
    if (USE_MOCK_DATA) {
      return { data: { success: true, data: mockOwnerData.farms } };
    }
    try {
      return await axiosInstance.get('/api/owner/farms');
    } catch (error) {
      console.error('API error, using mock:', error);
      return { data: { success: true, data: mockOwnerData.farms } };
    }
  }

  async getMonitoring(farmId, period = '1day') {
    if (USE_MOCK_DATA) {
      return {
        data: {
          success: true,
          data: {
            current: mockOwnerData.currentSensor,
            history: mockOwnerData.sensorHistory[period]
          }
        }
      };
    }
    try {
      return await axiosInstance.get(`/api/owner/farms/${farmId}/monitoring`, { params: { period } });
    } catch (error) {
      console.error('API error, using mock:', error);
      return {
        data: {
          success: true,
          data: {
            current: mockOwnerData.currentSensor,
            history: mockOwnerData.sensorHistory[period]
          }
        }
      };
    }
  }

  async getAnalytics(farmId, period = '1day') {
    if (USE_MOCK_DATA) {
      return {
        data: {
          success: true,
          data: mockOwnerData.analyticsHistory[period]
        }
      };
    }
    try {
      return await axiosInstance.get(`/api/owner/farms/${farmId}/analytics`, { params: { period } });
    } catch (error) {
      console.error('API error, using mock:', error);
      return {
        data: {
          success: true,
          data: mockOwnerData.analyticsHistory[period]
        }
      };
    }
  }

  async requestFarm(data) {
    if (USE_MOCK_DATA) {
      console.log('Mock: Request farm', data);
      return { data: { success: true, message: 'Permintaan terkirim (mock)' } };
    }
    try {
      return await axiosInstance.post('/api/owner/request-farm', data);
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }

  async exportAnalytics(farmId, format = 'excel') {
    if (USE_MOCK_DATA) {
      console.log('Mock: Export analytics', farmId, format);
      alert('Mock: Export akan didownload');
      return;
    }
    window.location.href = `${API_BASE_URL}/api/owner/farms/${farmId}/export/${format}`;
  }
}

export default new OwnerService();
