import React, { useState, useEffect } from 'react';
import ownerService from '../../services/ownerService';
import { handleError } from '../../utils/errorHandler';
import './DiagramAnalisis.css';

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
  const maxValue = 20;

  useEffect(() => {
    fetchAnalyticsData();
  }, [filters.timeRange, selectedFarmId]);

  const fetchAnalyticsData = async () => {
    try {
      const periodMap = {
        '1 Hari Terakhir': '1day',
        '1 Minggu Terakhir': '1week',
        '1 Bulan Terakhir': '1month',
        '6 Bulan Terakhir': '6months'
      };
      const period = periodMap[filters.timeRange] || '1day';

      const response = await ownerService.getAnalytics(selectedFarmId, period);
      const data = response.data.data || response.data;

      if (data.manual_data && data.manual_data.length > 0) {
        const formattedData = data.manual_data.map(item => ({
          time: new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          value: item.konsumsi_pakan || 7
        }));
        setChartData(formattedData);
      }
    } catch (error) {
      const errorMessage = handleError('DiagramAnalisis fetchData', error);
      console.error(errorMessage);
      // Fallback to mock data - already in state
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await ownerService.exportData(selectedFarmId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `data-kandang-${selectedFarmId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      const errorMessage = handleError('DiagramAnalisis exportData', error);
      alert('Gagal export data: ' + errorMessage);
    }
  };

  return (
    <div className="diagram-container">
      <div className="diagram-header">
        <h1>Analisis Laporan Peternakan</h1>
      </div>

      <div className="diagram-chart-section">
        <h2 className="section-title">Grafik Analisis Laporan Kandang A</h2>
        
        <div className="diagram-filters">
          <div className="filter-group">
            <label>Pilih Data 1 (Batang) :</label>
            <select 
              value={filters.data1}
              onChange={(e) => setFilters({...filters, data1: e.target.value})}
            >
              <option>Konsumsi Pakan</option>
              <option>Konsumsi Minum</option>
              <option>Rata-rata Bobot</option>
              <option>Jumlah Kematian</option>
              <option>Tidak Ada</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Pilih Data 2 (Garis) :</label>
            <select 
              value={filters.data2}
              onChange={(e) => setFilters({...filters, data2: e.target.value})}
            >
              <option>Konsumsi Pakan</option>
              <option>Konsumsi Minum</option>
              <option>Rata-rata Bobot</option>
              <option>Jumlah Kematian</option>
              <option>Tidak Ada</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Jangka Waktu :</label>
            <select 
              value={filters.timeRange}
              onChange={(e) => setFilters({...filters, timeRange: e.target.value})}
            >
              <option>1 Hari Terakhir</option>
              <option>1 Minggu Terakhir</option>
              <option>1 Bulan Terakhir</option>
              <option>6 Bulan Terakhir</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Pilih Kandang :</label>
            <select 
              value={filters.kandang}
              onChange={(e) => setFilters({...filters, kandang: e.target.value})}
            >
              <option>Kandang A</option>
              <option>Kandang B</option>
              <option>Kandang C</option>
            </select>
          </div>

          <div className="diagram-legend">
            <span className="legend-label">Keterangan:</span>
            <div className="legend-item">
              <span className="legend-color-orange"></span>
              <span>Pakan (Kg)</span>
            </div>
          </div>
        </div>

        <div className="diagram-chart-wrapper">
          <div className="diagram-y-axis-label">Kg</div>
          <div className="diagram-chart-content">
            <div className="diagram-y-values">
              <span>20</span>
              <span>15</span>
              <span>10</span>
              <span>5</span>
              <span>0</span>
            </div>
            <div className="diagram-bars-container">
              {chartData.map((data, index) => (
                <div key={index} className="diagram-bar-group">
                  <div 
                    className="diagram-bar"
                    style={{ height: `${(data.value / maxValue) * 100}%` }}
                  >
                    <div className="diagram-tooltip">{data.value} Kg</div>
                  </div>
                  <span className="diagram-time-label">{data.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="diagram-x-axis-label">Jam</div>
        </div>

        <div className="export-section">
          <button className="btn-export" onClick={handleExportExcel}>
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