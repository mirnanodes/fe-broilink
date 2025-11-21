import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiagramAnalisis = () => {
  const [hasMultipleCages, setHasMultipleCages] = useState(false);
  const [filters, setFilters] = useState({
    data1: 'Konsumsi Pakan',
    data2: 'Tidak Ada',
    timeRange: '1 Hari Terakhir',
    kandang: 'Kandang A'
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
        case 'Konsumsi Pakan':
          return labels.map(() => Math.floor(Math.random() * 10) + 5); // 5-15 kg
        case 'Konsumsi Minum':
          return labels.map(() => Math.floor(Math.random() * 10) + 10); // 10-20 liter
        case 'Rata-rata Bobot':
          return labels.map(() => (Math.random() * 2 + 0.5).toFixed(1)); // 0.5-2.5 kg
        case 'Jumlah Kematian':
          return labels.map(() => Math.floor(Math.random() * 8)); // 0-8 ekor
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
      'Konsumsi Pakan': { color: '#F59E0B', unit: 'Kg', max: 20, interval: 5 },
      'Konsumsi Minum': { color: '#06B6D4', unit: 'Liter', max: 20, interval: 5 },
      'Rata-rata Bobot': { color: '#10B981', unit: 'Kg', max: 3, interval: 0.5 },
      'Jumlah Kematian': { color: '#EF4444', unit: 'Ekor', max: 10, interval: 2 }
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
          const response = await axios.get('/api/owner/analytics');
          const data = response.data.data;

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

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Waktu', filters.data1];
    if (filters.data2 !== 'Tidak Ada') {
      headers.push(filters.data2);
    }

    let csvContent = headers.join(',') + '\n';

    chartData.labels.forEach((label, i) => {
      let row = [label];
      if (chartData.data1) row.push(chartData.data1[i]);
      if (chartData.data2) row.push(chartData.data2[i]);
      csvContent += row.join(',') + '\n';
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_${filters.kandang}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FEF7F5]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analisis Laporan Peternakan</h1>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Grafik Analisis Laporan {hasMultipleCages ? filters.kandang : 'Kandang A'}
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
              <option>Konsumsi Pakan</option>
              <option>Konsumsi Minum</option>
              <option>Rata-rata Bobot</option>
              <option>Jumlah Kematian</option>
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
              <option>Konsumsi Pakan</option>
              <option>Konsumsi Minum</option>
              <option>Rata-rata Bobot</option>
              <option>Jumlah Kematian</option>
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
                    <span className="text-xs text-gray-600">{filters.data1.replace('Konsumsi ', '').replace('Rata-rata ', '').replace('Jumlah ', '')} ({config1.unit})</span>
                  </div>
                )}
                {filters.data2 !== 'Tidak Ada' && (
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-0.5" style={{backgroundColor: config2.color}}></span>
                    <span className="text-xs text-gray-600">{filters.data2.replace('Konsumsi ', '').replace('Rata-rata ', '').replace('Jumlah ', '')} ({config2.unit})</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative h-96 mb-6">
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
                          height: `${(parseFloat(chartData.data1[index]) / config1.max) * 100}%`,
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
                        const y = 100 - ((parseFloat(chartData.data2[i]) / config2.max) * 100);
                        return `${x}%,${y}%`;
                      }).join(' ')}
                      fill="none"
                      stroke={config2.color}
                      strokeWidth="3"
                    />
                    {chartData.labels.map((label, i) => {
                      const x = (i / (chartData.labels.length - 1)) * 100;
                      const y = 100 - ((parseFloat(chartData.data2[i]) / config2.max) * 100);
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

        {/* Export Button */}
        <div className="flex justify-center">
          <button
            onClick={handleExportCSV}
            className="bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            Export ke CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagramAnalisis;
