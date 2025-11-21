import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Monitoring = () => {
  const [hasMultipleCages, setHasMultipleCages] = useState(false);
  const [filters, setFilters] = useState({
    data1: 'Suhu Aktual',
    data2: 'Tidak Ada',
    timeRange: '1 Hari Terakhir',
    kandang: 'Kandang A'
  });

  // Mock sensor data
  const [sensorData, setSensorData] = useState({
    temperature: 35,
    humidity: 75,
    ammonia: 18,
    status: 'Bahaya'
  });

  // Mock cages list
  const [cages, setCages] = useState([
    { id: 1, name: 'Kandang A' }
  ]);

  // Get chart data based on filters
  const getChartData = () => {
    const timeRangeData = {
      '1 Hari Terakhir': ['00.00', '04.00', '08.00', '12.00', '16.00', '20.00'],
      '1 Minggu Terakhir': ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
      '1 Bulan Terakhir': ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
      '6 Bulan Terakhir': ['Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar']
    };

    const labels = timeRangeData[filters.timeRange];

    // Generate mock values based on data type
    const generateValues = (dataType) => {
      switch(dataType) {
        case 'Suhu Aktual':
          return labels.map(() => Math.floor(Math.random() * 15) + 25); // 25-40
        case 'Kelembapan Aktual':
          return labels.map(() => Math.floor(Math.random() * 30) + 60); // 60-90
        case 'Kadar Amonia':
          return labels.map(() => Math.floor(Math.random() * 15) + 5); // 5-20
        default:
          return labels.map(() => 0);
      }
    };

    return {
      labels,
      data1: filters.data1 !== 'Tidak Ada' ? generateValues(filters.data1) : null,
      data2: filters.data2 !== 'Tidak Ada' ? generateValues(filters.data2) : null
    };
  };

  const chartData = getChartData();

  // Get chart configuration based on data type
  const getDataConfig = (dataType) => {
    const configs = {
      'Suhu Aktual': { color: '#F97316', unit: '°C', max: 40, interval: 10 },
      'Kelembapan Aktual': { color: '#14B8A6', unit: '%', max: 100, interval: 20 },
      'Kadar Amonia': { color: '#8B5CF6', unit: 'ppm', max: 20, interval: 5 }
    };
    return configs[dataType] || { color: '#999', unit: '', max: 100, interval: 20 };
  };

  const config1 = getDataConfig(filters.data1);
  const config2 = getDataConfig(filters.data2);

  // Generate Y-axis labels for primary data
  const yAxisLabels = [];
  for (let i = config1.max; i >= 0; i -= config1.interval) {
    yAxisLabels.push(i);
  }

  // Generate Y-axis labels for secondary data (right side)
  const yAxisLabels2 = [];
  if (filters.data2 !== 'Tidak Ada') {
    for (let i = config2.max; i >= 0; i -= config2.interval) {
      yAxisLabels2.push(i);
    }
  }

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('/api/owner/monitoring');
          const data = response.data.data;

          if (data.sensor) {
            setSensorData({
              temperature: data.sensor.temperature || 35,
              humidity: data.sensor.humidity || 75,
              ammonia: data.sensor.ammonia || 18,
              status: data.sensor.status || 'Normal'
            });
          }

          if (data.cages && data.cages.length > 0) {
            setCages(data.cages);
            setHasMultipleCages(data.cages.length > 1);
          }
        }
      } catch (error) {
        console.log('API not available, using mock data');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FEF7F5]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Monitoring Detail Peternakan</h1>
        <p className="text-gray-600 text-sm mt-1">Pantau kondisi vital kandang Anda secara real-time</p>
      </div>

      {/* Metrics Grid - 4 Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Suhu Aktual */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F97316] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a4 4 0 00-4 4v6a6 6 0 1012 0V6a4 4 0 00-4-4V2zM8 6a2 2 0 114 0v6.5a4 4 0 11-4 0V6z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Suhu Aktual</p>
              <p className="text-2xl font-bold text-gray-900">{sensorData.temperature}°C</p>
            </div>
          </div>
        </div>

        {/* Kelembapan Aktual */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2s-5 6-5 9a5 5 0 0010 0c0-3-5-9-5-9z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Kelembapan Aktual</p>
              <p className="text-2xl font-bold text-gray-900">{sensorData.humidity}%</p>
            </div>
          </div>
        </div>

        {/* Kadar Amonia */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 6h4v8H3V6zm6-2h4v10H9V4zm6 4h4v6h-4V8z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Kadar Amonia</p>
              <p className="text-2xl font-bold text-gray-900">{sensorData.ammonia} ppm</p>
            </div>
          </div>
        </div>

        {/* Status Kandang */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              sensorData.status === 'Normal' ? 'bg-[#10B981]' :
              sensorData.status === 'Waspada' ? 'bg-[#FEE700]' :
              'bg-[#EF4444]'
            }`}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status Kandang</p>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                sensorData.status === 'Normal' ? 'bg-[#10B981] text-white' :
                sensorData.status === 'Waspada' ? 'bg-[#FEE700] text-gray-900' :
                'bg-[#EF4444] text-white'
              }`}>
                {sensorData.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Grafik Data Sensor {hasMultipleCages ? filters.kandang : 'Kandang A'}
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Data 1 (Batang) :</label>
            <select
              value={filters.data1}
              onChange={(e) => setFilters({...filters, data1: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
            >
              <option>Suhu Aktual</option>
              <option>Kelembapan Aktual</option>
              <option>Kadar Amonia</option>
              <option>Tidak Ada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Data 2 (Garis) :</label>
            <select
              value={filters.data2}
              onChange={(e) => setFilters({...filters, data2: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
            >
              <option>Suhu Aktual</option>
              <option>Kelembapan Aktual</option>
              <option>Kadar Amonia</option>
              <option>Tidak Ada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jangka Waktu :</label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters({...filters, timeRange: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
            >
              <option>1 Hari Terakhir</option>
              <option>1 Minggu Terakhir</option>
              <option>1 Bulan Terakhir</option>
              <option>6 Bulan Terakhir</option>
            </select>
          </div>

          {hasMultipleCages && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Kandang :</label>
              <select
                value={filters.kandang}
                onChange={(e) => setFilters({...filters, kandang: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
              >
                {cages.map(cage => (
                  <option key={cage.id} value={cage.name}>{cage.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-end">
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">Keterangan:</span>
              <div className="space-y-1">
                {filters.data1 !== 'Tidak Ada' && (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded" style={{backgroundColor: config1.color}}></span>
                    <span className="text-xs text-gray-600">{filters.data1.replace(' Aktual', '')} ({config1.unit})</span>
                  </div>
                )}
                {filters.data2 !== 'Tidak Ada' && (
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-0.5" style={{backgroundColor: config2.color}}></span>
                    <span className="text-xs text-gray-600">{filters.data2.replace(' Aktual', '')} ({config2.unit})</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative h-80">
          <div className="flex h-full">
            {/* Y-axis labels (left) */}
            <div className="flex flex-col justify-between pr-2 text-xs text-gray-600 mr-2">
              {yAxisLabels.map((label, i) => (
                <span key={i}>{label}</span>
              ))}
            </div>

            {/* Chart area */}
            <div className="flex-1 flex flex-col relative">
              {/* Chart content */}
              <div className="flex-1 flex items-end justify-around gap-2 border-l border-b border-gray-300 px-4 relative">
                {chartData.labels.map((label, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 relative h-full">
                    {/* Bar chart */}
                    {chartData.data1 && (
                      <div
                        className="w-full rounded-t-md relative group"
                        style={{
                          height: `${(chartData.data1[index] / config1.max) * 100}%`,
                          backgroundColor: config1.color
                        }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {chartData.data1[index]} {config1.unit}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Line chart overlay */}
                {chartData.data2 && (
                  <svg className="absolute inset-0 pointer-events-none" style={{width: '100%', height: '100%'}}>
                    <polyline
                      points={chartData.labels.map((label, i) => {
                        const x = (i / (chartData.labels.length - 1)) * 100;
                        const y = 100 - ((chartData.data2[i] / config2.max) * 100);
                        return `${x}%,${y}%`;
                      }).join(' ')}
                      fill="none"
                      stroke={config2.color}
                      strokeWidth="3"
                    />
                    {chartData.labels.map((label, i) => {
                      const x = (i / (chartData.labels.length - 1)) * 100;
                      const y = 100 - ((chartData.data2[i] / config2.max) * 100);
                      return (
                        <circle
                          key={i}
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="4"
                          fill={config2.color}
                          className="cursor-pointer"
                        />
                      );
                    })}
                  </svg>
                )}
              </div>

              {/* X-axis labels */}
              <div className="flex justify-around mt-2 text-xs text-gray-600">
                {chartData.labels.map((label, index) => (
                  <span key={index} className="flex-1 text-center">{label}</span>
                ))}
              </div>
              <div className="text-center text-sm text-gray-700 font-medium mt-1">
                {filters.timeRange.includes('Hari') ? 'Jam' :
                 filters.timeRange.includes('Minggu') ? 'Hari' :
                 filters.timeRange.includes('Bulan') && filters.timeRange.includes('6') ? 'Bulan' :
                 'Minggu'}
              </div>
            </div>

            {/* Y-axis label (left) */}
            <div className="flex items-center ml-2">
              <span className="text-sm text-gray-700 font-medium">{config1.unit}</span>
            </div>

            {/* Y-axis labels (right) - for line chart */}
            {filters.data2 !== 'Tidak Ada' && (
              <>
                <div className="flex flex-col justify-between pl-4 text-xs text-gray-600 ml-2">
                  {yAxisLabels2.map((label, i) => (
                    <span key={i}>{label}</span>
                  ))}
                </div>
                <div className="flex items-center ml-2">
                  <span className="text-sm text-gray-700 font-medium">{config2.unit}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
