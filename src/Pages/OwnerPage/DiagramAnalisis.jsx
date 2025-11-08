import React, { useState } from 'react';
import './DiagramAnalisis.css';

const DiagramAnalisis = () => {
  const [filters, setFilters] = useState({
    data1: 'Konsumsi Pakan',
    data2: 'Tidak Ada',
    timeRange: '1 Hari Terakhir',
    kandang: 'Kandang A'
  });

  const chartData = [
    { time: '00.00', value: 7 },
    { time: '04.00', value: 14 },
    { time: '08.00', value: 2 },
    { time: '12.00', value: 3 },
    { time: '16.00', value: 14 },
    { time: '20.00', value: 5 }
  ];

  const maxValue = 20;

  const handleExportExcel = () => {
    console.log('Export to Excel');
    alert('Fitur export ke Excel akan diimplementasikan');
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