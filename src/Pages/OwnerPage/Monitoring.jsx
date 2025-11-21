import React, { useState, useEffect } from 'react';
import ownerService from '../../services/ownerService';
import { handleError } from '../../utils/errorHandler';

const Monitoring = () => {
  const [filters, setFilters] = useState({
    data1: 'Suhu Aktual',
    data2: 'Tidak Ada',
    timeRange: '1 Hari Terakhir',
    kandang: 'Kandang A'
  });

  const [sensorData, setSensorData] = useState({
    temperature: 35,
    humidity: 75,
    ammonia: 18,
    status: 'Bahaya'
  });

  const [chartData, setChartData] = useState([
    { time: '00.00', value: 24 },
    { time: '04.00', value: 24 },
    { time: '08.00', value: 24 },
    { time: '12.00', value: 27 },
    { time: '16.00', value: 27 },
    { time: '20.00', value: 35 }
  ]);

  const [selectedFarmId, setSelectedFarmId] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [apiError, setApiError] = useState(null);
  const maxValue = 40;

  useEffect(() => {
    fetchMonitoringData();
  }, [filters.timeRange, selectedFarmId]);

  const fetchMonitoringData = async () => {
    setIsLoadingData(true);
    setApiError(null);

    console.log('=== MONITORING: Starting data fetch ===');
    console.log('Token:', localStorage.getItem('token') ? 'EXISTS' : 'MISSING');
    console.log('Farm ID:', selectedFarmId);
    console.log('Time Range:', filters.timeRange);

    try {
      const periodMap = {
        '1 Hari Terakhir': '1day',
        '1 Minggu Terakhir': '1week',
        '1 Bulan Terakhir': '1month',
        '6 Bulan Terakhir': '6months'
      };
      const period = periodMap[filters.timeRange] || '1day';

      console.log('Calling ownerService.getMonitoring()...');
      const response = await ownerService.getMonitoring(selectedFarmId, period);

      console.log('✅ API Response received:', response);
      console.log('Response data:', response.data);

      const data = response.data.data || response.data;

      if (data.current_sensor) {
        console.log('✅ Setting sensor data from API:', data.current_sensor);
        setSensorData({
          temperature: data.current_sensor.temperature || 35,
          humidity: data.current_sensor.humidity || 75,
          ammonia: data.current_sensor.ammonia || 18,
          status: data.current_sensor.status || 'Bahaya'
        });
      } else {
        console.warn('⚠️ No current_sensor in API response');
      }

      if (data.historical_data && data.historical_data.length > 0) {
        const formattedData = data.historical_data.map(item => ({
          time: new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          value: item.temperature || 24
        }));
        console.log('✅ Setting chart data from API:', formattedData);
        setChartData(formattedData);
      } else {
        console.warn('⚠️ No historical_data in API response');
      }

      setIsLoadingData(false);
    } catch (error) {
      const errorMessage = handleError('Monitoring fetchData', error);
      console.error('❌ API ERROR:', errorMessage);
      console.error('Error details:', error);
      console.error('Error response:', error.response);

      setApiError(errorMessage);
      setIsLoadingData(false);

      // Fallback to mock data - already in state
      console.log('📊 Using mock data as fallback');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Error Alert */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Gagal Memuat Data dari Backend</h3>
              <p className="text-sm text-red-700 mt-1">{apiError}</p>
              <p className="text-xs text-red-600 mt-2">📊 Menampilkan data mock sebagai fallback. Periksa console untuk detail error.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Monitoring Detail Peternakan</h1>
        <p className="text-gray-600 text-sm mt-1">Pantau kondisi vital kandang Anda secara real-time</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Temperature Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="currentColor">
                <path d="M20 5c-2.21 0-4 1.79-4 4v12.17c-1.79 1.06-3 3-3 5.23 0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.23-1.21-4.17-3-5.23V9c0-2.21-1.79-4-4-4zm0 23c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
              </svg>
            </div>
            <div>
              <span className="block text-sm text-gray-600">Suhu Aktual</span>
              <span className="block text-2xl font-bold text-gray-900">{sensorData.temperature}°C</span>
            </div>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="currentColor">
                <path d="M20 5c-6 7-10 12-10 17 0 5.52 4.48 10 10 10s10-4.48 10-10c0-5-4-10-10-17zm0 24c-3.31 0-6-2.69-6-6 0-2.5 2-5.5 6-10 4 4.5 6 7.5 6 10 0 3.31-2.69 6-6 6z"/>
              </svg>
            </div>
            <div>
              <span className="block text-sm text-gray-600">Kelembapan Aktual</span>
              <span className="block text-2xl font-bold text-gray-900">{sensorData.humidity}%</span>
            </div>
          </div>
        </div>

        {/* Ammonia Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="currentColor">
                <path d="M8 12h4v16H8V12zm10-4h4v20h-4V8zm10 8h4v12h-4V16z"/>
              </svg>
            </div>
            <div>
              <span className="block text-sm text-gray-600">Kadar Amonia</span>
              <span className="block text-2xl font-bold text-gray-900">{sensorData.ammonia} ppm</span>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="currentColor">
                <path d="M20 5L6 13v8c0 8.84 6.12 17.09 14 19 7.88-1.91 14-10.16 14-19v-8L20 5zm-2 24l-6-6 1.41-1.41L18 26.17l8.59-8.58L28 19l-10 10z"/>
              </svg>
            </div>
            <div>
              <span className="block text-sm text-gray-600">Status Kandang</span>
              <span className="inline-block mt-1 px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                {sensorData.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Grafik Data Sensor Kandang A</h2>

        {/* Chart Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 pb-6 border-b border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Data 1 (Batang):</label>
            <select
              value={filters.data1}
              onChange={(e) => setFilters({...filters, data1: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Suhu Aktual</option>
              <option>Kelembapan Aktual</option>
              <option>Kadar Amonia</option>
              <option>Tidak Ada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Data 2 (Garis):</label>
            <select
              value={filters.data2}
              onChange={(e) => setFilters({...filters, data2: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Suhu Aktual</option>
              <option>Kelembapan Aktual</option>
              <option>Kadar Amonia</option>
              <option>Tidak Ada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jangka Waktu:</label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters({...filters, timeRange: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>1 Hari Terakhir</option>
              <option>1 Minggu Terakhir</option>
              <option>1 Bulan Terakhir</option>
              <option>6 Bulan Terakhir</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Kandang:</label>
            <select
              value={filters.kandang}
              onChange={(e) => setFilters({...filters, kandang: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Kandang A</option>
              <option>Kandang B</option>
              <option>Kandang C</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Keterangan:</span>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-orange-500 rounded"></span>
                <span className="text-sm text-gray-600">Suhu (°C)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="flex gap-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 transform -rotate-90 whitespace-nowrap">°C</span>
          </div>
          <div className="flex-1">
            <div className="flex gap-4 h-80">
              {/* Y Axis */}
              <div className="flex flex-col justify-between text-sm text-gray-600 py-4">
                <span>40</span>
                <span>30</span>
                <span>20</span>
                <span>10</span>
                <span>0</span>
              </div>
              {/* Chart Bars */}
              <div className="flex-1 flex items-end gap-6 p-4 border-l-2 border-b-2 border-gray-300">
                {chartData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t min-h-[20px] relative group"
                      style={{ height: `${(data.value / maxValue) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.value}°C
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">{data.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center text-sm font-medium text-gray-700 mt-2">Jam</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
