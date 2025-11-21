import React, { useState, useEffect } from 'react';
import ownerService from '../../services/ownerService';
import { handleError } from '../../utils/errorHandler';
import './Monitoring.css';

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
  const maxValue = 40;

  useEffect(() => {
    fetchMonitoringData();
  }, [filters.timeRange, selectedFarmId]);

  const fetchMonitoringData = async () => {
    try {
      const periodMap = {
        '1 Hari Terakhir': '1day',
        '1 Minggu Terakhir': '1week',
        '1 Bulan Terakhir': '1month',
        '6 Bulan Terakhir': '6months'
      };
      const period = periodMap[filters.timeRange] || '1day';

      const response = await ownerService.getMonitoring(selectedFarmId, period);
      const data = response.data.data || response.data;

      if (data.current_sensor) {
        setSensorData({
          temperature: data.current_sensor.temperature || 35,
          humidity: data.current_sensor.humidity || 75,
          ammonia: data.current_sensor.ammonia || 18,
          status: data.current_sensor.status || 'Bahaya'
        });
      }

      if (data.historical_data && data.historical_data.length > 0) {
        const formattedData = data.historical_data.map(item => ({
          time: new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          value: item.temperature || 24
        }));
        setChartData(formattedData);
      }
    } catch (error) {
      const errorMessage = handleError('Monitoring fetchData', error);
      console.error(errorMessage);
      // Fallback to mock data - already in state
    }
  };

  return (
    <div className="monitoring-container">
      <div className="monitoring-header">
        <div>
          <h1>Monitoring Detail Peternakan</h1>
          <p className="subtitle">Pantau kondisi vital kandang Anda secara real-time</p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon temperature">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
              <path d="M20 5c-2.21 0-4 1.79-4 4v12.17c-1.79 1.06-3 3-3 5.23 0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.23-1.21-4.17-3-5.23V9c0-2.21-1.79-4-4-4zm0 23c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Suhu Aktual</span>
            <span className="metric-value">{sensorData.temperature}°C</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon humidity">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
              <path d="M20 5c-6 7-10 12-10 17 0 5.52 4.48 10 10 10s10-4.48 10-10c0-5-4-10-10-17zm0 24c-3.31 0-6-2.69-6-6 0-2.5 2-5.5 6-10 4 4.5 6 7.5 6 10 0 3.31-2.69 6-6 6z"/>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Kelembapan Aktual</span>
            <span className="metric-value">{sensorData.humidity}%</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon ammonia">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
              <path d="M8 12h4v16H8V12zm10-4h4v20h-4V8zm10 8h4v12h-4V16z"/>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Kadar Amonia</span>
            <span className="metric-value">{sensorData.ammonia} ppm</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon status">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
              <path d="M20 5L6 13v8c0 8.84 6.12 17.09 14 19 7.88-1.91 14-10.16 14-19v-8L20 5zm-2 24l-6-6 1.41-1.41L18 26.17l8.59-8.58L28 19l-10 10z"/>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Status Kandang</span>
            <span className="status-badge-danger">{sensorData.status}</span>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h2 className="section-title">Grafik Data Sensor Kandang A</h2>
        
        <div className="chart-filters">
          <div className="filter-group">
            <label>Pilih Data 1 (Batang) :</label>
            <select 
              value={filters.data1}
              onChange={(e) => setFilters({...filters, data1: e.target.value})}
            >
              <option>Suhu Aktual</option>
              <option>Kelembapan Aktual</option>
              <option>Kadar Amonia</option>
              <option>Tidak Ada</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Pilih Data 2 (Garis) :</label>
            <select 
              value={filters.data2}
              onChange={(e) => setFilters({...filters, data2: e.target.value})}
            >
              <option>Suhu Aktual</option>
              <option>Kelembapan Aktual</option>
              <option>Kadar Amonia</option>
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

          <div className="chart-legend">
            <span className="legend-label">Keterangan:</span>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#ff9800'}}></span>
              <span>Suhu (°C)</span>
            </div>
          </div>
        </div>

        <div className="chart-wrapper">
          <div className="chart-y-axis-label">°C</div>
          <div className="chart-content">
            <div className="chart-y-values">
              <span>40</span>
              <span>30</span>
              <span>20</span>
              <span>10</span>
              <span>0</span>
            </div>
            <div className="chart-bars-container">
              {chartData.map((data, index) => (
                <div key={index} className="chart-bar-group">
                  <div 
                    className="chart-bar"
                    style={{ height: `${(data.value / maxValue) * 100}%` }}
                  >
                    <div className="bar-tooltip">{data.value}°C</div>
                  </div>
                  <span className="chart-time-label">{data.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-x-axis-label">Jam</div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;