import React, { useState, useEffect } from 'react';
import ownerService from '../../services/ownerService';
import { handleError } from '../../utils/errorHandler';

const DiagramAnalisis = () => {
  const [filters, setFilters] = useState({
    data1: 'Konsumsi Pakan',
    data2: 'Tidak Ada',
    timeRange: '1 Hari Terakhir',
    kandang: 'Kandang A'
  });

  const [chartData, setChartData] = useState([
    { time: '00.00', value: 7 },
    { time: '04.00', value: 14 },
    { time: '08.00', value: 2 },
    { time: '12.00', value: 3 },
    { time: '16.00', value: 14 },
    { time: '20.00', value: 5 }
  ]);

  const [selectedFarmId, setSelectedFarmId] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [apiError, setApiError] = useState(null);
  const maxValue = 20;

  useEffect(() => {
    fetchAnalyticsData();
  }, [filters.timeRange, selectedFarmId]);

  const fetchAnalyticsData = async () => {
    setIsLoadingData(true);
    setApiError(null);

    console.log('=== DIAGRAM ANALISIS: Starting data fetch ===');
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

      console.log('Calling ownerService.getAnalytics()...');
      const response = await ownerService.getAnalytics(selectedFarmId, period);

      console.log('✅ API Response received:', response);
      console.log('Response data:', response.data);

      const data = response.data.data || response.data;

      if (data.manual_data && data.manual_data.length > 0) {
        const formattedData = data.manual_data.map(item => ({
          time: new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          value: item.konsumsi_pakan || 7
        }));
        console.log('✅ Setting chart data from API:', formattedData);
        setChartData(formattedData);
      } else {
        console.warn('⚠️ No manual_data in API response');
      }

      setIsLoadingData(false);
    } catch (error) {
      const errorMessage = handleError('DiagramAnalisis fetchData', error);
      console.error('❌ API ERROR:', errorMessage);
      console.error('Error details:', error);
      console.error('Error response:', error.response);

      setApiError(errorMessage);
      setIsLoadingData(false);

      // Fallback to mock data - already in state
      console.log('📊 Using mock data as fallback');
    }
  };

  const handleExportExcel = async () => {
    try {
      console.log('Exporting data for farm:', selectedFarmId);
      const response = await ownerService.exportData(selectedFarmId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `data-kandang-${selectedFarmId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      console.log('✅ Export successful');
    } catch (error) {
      const errorMessage = handleError('DiagramAnalisis exportData', error);
      console.error('❌ Export error:', errorMessage);
      alert('Gagal export data: ' + errorMessage);
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
        <h1 className="text-3xl font-bold text-gray-900">Analisis Laporan Peternakan</h1>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Grafik Analisis Laporan Kandang A</h2>

        {/* Chart Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 pb-6 border-b border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Data 1 (Batang):</label>
            <select
              value={filters.data1}
              onChange={(e) => setFilters({...filters, data1: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Konsumsi Pakan</option>
              <option>Konsumsi Minum</option>
              <option>Rata-rata Bobot</option>
              <option>Jumlah Kematian</option>
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
              <option>Konsumsi Pakan</option>
              <option>Konsumsi Minum</option>
              <option>Rata-rata Bobot</option>
              <option>Jumlah Kematian</option>
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
                <span className="text-sm text-gray-600">Pakan (Kg)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="flex gap-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 transform -rotate-90 whitespace-nowrap">Kg</span>
          </div>
          <div className="flex-1">
            <div className="flex gap-4 h-80">
              {/* Y Axis */}
              <div className="flex flex-col justify-between text-sm text-gray-600 py-4">
                <span>20</span>
                <span>15</span>
                <span>10</span>
                <span>5</span>
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
                        {data.value} Kg
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

        {/* Export Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12l-4-4h3V3h2v5h3l-4 4z"/>
              <path d="M3 14h14v3H3v-3z"/>
            </svg>
            Export ke Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagramAnalisis;
