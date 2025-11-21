import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardOwner = () => {
  // State untuk mengecek apakah owner punya lebih dari 1 kandang
  const [hasMultipleCages, setHasMultipleCages] = useState(false);
  const [selectedCageForChart, setSelectedCageForChart] = useState('Kandang A');
  const [selectedDataType, setSelectedDataType] = useState('Mortalitas');

  // Mock data untuk kandang
  const [cages, setCages] = useState([
    { id: 1, name: 'Kandang A', status: 'Waspada', temp: '35°C' },
  ]);

  // Mock data untuk activities
  const [activities, setActivities] = useState([
    { time: '18.30', activity: 'Update Indikator', detail: 'Kelembapan: 70%', status: 'Normal' },
    { time: '17.56', activity: 'Laporan Pakan', detail: 'oleh Fadil (Kandang C)', status: 'Info' },
    { time: '12.45', activity: 'Laporan Pakan', detail: 'oleh Budi (Kandang B)', status: 'Info' },
    { time: '08.00', activity: 'Update Indikator', detail: 'Suhu: 35°C (Kandang A)', status: 'Waspada' },
    { time: '07.30', activity: 'Update Indikator', detail: 'Suhu: 35.1°C (Kandang C)', status: 'Bahaya' }
  ]);

  // Mock data untuk chart - berbeda tergantung data type
  const getChartData = () => {
    const baseData = ['00.00', '06.00', '12.00', '18.00'];
    switch(selectedDataType) {
      case 'Mortalitas':
        return baseData.map((time, i) => ({ time, value: [5, 4, 6, 5][i] }));
      case 'Bobot':
        return baseData.map((time, i) => ({ time, value: [1500, 1600, 1650, 1700][i] }));
      case 'Pakan':
        return baseData.map((time, i) => ({ time, value: [8, 10, 12, 14][i] }));
      case 'Minum':
        return baseData.map((time, i) => ({ time, value: [15, 18, 20, 22][i] }));
      default:
        return baseData.map((time) => ({ time, value: 0 }));
    }
  };

  const chartData = getChartData();

  // Fungsi untuk menentukan max value dan interval chart
  const getChartConfig = () => {
    switch(selectedDataType) {
      case 'Mortalitas':
        return { max: 8, interval: 2, unit: 'Ekor' };
      case 'Bobot':
        return { max: 2000, interval: 100, unit: 'gr' };
      case 'Pakan':
        return { max: 20, interval: 2, unit: 'kg' };
      case 'Minum':
        return { max: 30, interval: 2, unit: 'Liter' };
      default:
        return { max: 10, interval: 2, unit: '' };
    }
  };

  const chartConfig = getChartConfig();
  const yAxisLabels = [];
  for (let i = chartConfig.max; i >= 0; i -= chartConfig.interval) {
    yAxisLabels.push(i);
  }

  // Fetch data dari API atau gunakan mock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Coba ambil dari API jika Laravel running
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('/api/owner/dashboard');
          const data = response.data.data;

          if (data.farms && data.farms.length > 0) {
            const formattedCages = data.farms.map(farm => ({
              id: farm.id,
              name: farm.farm_name,
              status: farm.status || 'Normal',
              temp: farm.latest_sensor ? `${farm.latest_sensor.temperature}°C` : '32°C'
            }));
            setCages(formattedCages);
            setHasMultipleCages(formattedCages.length > 1);
          }

          if (data.recent_reports && data.recent_reports.length > 0) {
            const acts = data.recent_reports.map(r => ({
              time: new Date(r.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
              activity: r.report_type || 'Laporan Manual',
              detail: `${r.notes || ''}`,
              status: r.status || 'Info'
            }));
            setActivities(acts);
          }
        }
      } catch (error) {
        console.log('API not available, using mock data');
      }
    };
    fetchData();
  }, []);

  const handlePengajuan = () => {
    alert('Form pengajuan permintaan akan dibuka');
  };

  // Render status emblem berdasarkan status
  const renderStatusEmblem = (status) => {
    const statusConfig = {
      'Normal': { bg: 'bg-[#10B981]', icon: '✓' },
      'Waspada': { bg: 'bg-[#FEE700]', icon: '!' },
      'Bahaya': { bg: 'bg-[#EF4444]', icon: '⚠' }
    };
    const config = statusConfig[status] || statusConfig['Normal'];

    return (
      <div className={`w-20 h-20 ${config.bg} rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
        {config.icon}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FEF7F5]">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Owner</h1>
          <p className="text-gray-600 text-sm mt-1">Pantau kondisi semua kandang dan aktivitas peternakan Anda</p>
        </div>
        <button
          onClick={handlePengajuan}
          className="bg-[#3B82F6] hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span className="text-xl font-bold">+</span>
          Pengajuan Permintaan
        </button>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Card Kondisi Kandang */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Kondisi Kandang</h2>
          <div className="flex gap-4 justify-center items-center flex-wrap">
            {cages.map((cage) => (
              <div key={cage.id} className="flex flex-col items-center">
                {renderStatusEmblem(cage.status)}
                <h3 className="font-semibold text-gray-900 mt-3">{cage.name}</h3>
                <p className={`text-sm font-medium ${
                  cage.status === 'Normal' ? 'text-[#10B981]' :
                  cage.status === 'Waspada' ? 'text-[#FEE700]' :
                  'text-[#EF4444]'
                }`}>{cage.status}</p>
                <p className="text-xs text-gray-500">{cage.temp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card Analisis Laporan */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Analisis Laporan (Terbaru)</h2>
            <div className="flex gap-2">
              {hasMultipleCages && (
                <select
                  value={selectedCageForChart}
                  onChange={(e) => setSelectedCageForChart(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
                >
                  {cages.map(cage => (
                    <option key={cage.id} value={cage.name}>{cage.name}</option>
                  ))}
                </select>
              )}
              <select
                value={selectedDataType}
                onChange={(e) => setSelectedDataType(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
              >
                <option value="Mortalitas">Mortalitas</option>
                <option value="Bobot">Bobot</option>
                <option value="Pakan">Pakan</option>
                <option value="Minum">Minum</option>
              </select>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-64">
            <div className="flex h-full">
              {/* Y-axis labels */}
              <div className="flex flex-col justify-between pr-2 text-xs text-gray-600">
                {yAxisLabels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>

              {/* Chart area */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-end justify-around gap-2 border-l border-b border-gray-300 px-4">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-[#EF4444] rounded-t-md relative group"
                        style={{ height: `${(data.value / chartConfig.max) * 100}%` }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded">
                          {data.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* X-axis labels */}
                <div className="flex justify-around mt-2 text-xs text-gray-600">
                  {chartData.map((data, index) => (
                    <span key={index} className="flex-1 text-center">{data.time}</span>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-700 font-medium mt-1">Jam</div>
              </div>

              {/* Y-axis label */}
              <div className="flex items-center ml-2">
                <span className="text-sm text-gray-700 font-medium transform -rotate-0">{chartConfig.unit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Aktivitas Peternakan */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Peternakan</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Waktu</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Aktivitas</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{activity.time}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{activity.activity}</span>
                      <span className="text-xs text-gray-500">{activity.detail}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'Normal' ? 'bg-[#10B981] text-white' :
                      activity.status === 'Info' ? 'bg-[#3B82F6] text-white' :
                      activity.status === 'Waspada' ? 'bg-[#FEE700] text-gray-900' :
                      'bg-[#EF4444] text-white'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOwner;
