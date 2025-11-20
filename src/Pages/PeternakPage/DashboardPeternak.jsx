import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPeternak() {
  const [chartType, setChartType] = useState({ data1: 'bar', data2: null });
  const [selectedData1, setSelectedData1] = useState('pakan');
  const [selectedData2, setSelectedData2] = useState('');

  // Mock data - replace with actual API calls
  const sensorData = {
    suhu: 32,
    kelembapan: 65,
    amonia: 15,
    statusKandang: 'Normal'
  };

  const reportSummary = {
    totalPakan: 450,
    totalMinum: 380,
    rataBobot: 1.8,
    totalKematian: 12
  };

  const chartData = {
    pakan: {
      labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
      data: [10, 12, 11, 13, 15, 14, 16],
      color: '#F59E0B',
      unit: 'Kg',
      yMax: 20,
      interval: 5
    },
    minum: {
      labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
      data: [8, 10, 9, 11, 13, 12, 14],
      color: '#06B6D4',
      unit: 'Liter',
      yMax: 20,
      interval: 5
    },
    bobot: {
      labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
      data: [1.2, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9],
      color: '#10B981',
      unit: 'Kg',
      yMax: 3.0,
      interval: 0.5
    },
    kematian: {
      labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
      data: [1, 2, 1, 3, 2, 2, 1],
      color: '#EF4444',
      unit: 'Ekor',
      yMax: 10,
      interval: 2
    }
  };

  const getChartConfig = () => {
    const datasets = [];

    if (selectedData1) {
      const data1 = chartData[selectedData1];
      datasets.push({
        label: selectedData1.charAt(0).toUpperCase() + selectedData1.slice(1),
        data: data1.data,
        backgroundColor: data1.color + '80',
        borderColor: data1.color,
        borderWidth: 2,
        type: chartType.data1,
        yAxisID: 'y'
      });
    }

    if (selectedData2) {
      const data2 = chartData[selectedData2];
      datasets.push({
        label: selectedData2.charAt(0).toUpperCase() + selectedData2.slice(1),
        data: data2.data,
        backgroundColor: data2.color + '80',
        borderColor: data2.color,
        borderWidth: 2,
        type: chartType.data2,
        yAxisID: 'y1'
      });
    }

    const primaryData = chartData[selectedData1];
    const secondaryData = selectedData2 ? chartData[selectedData2] : null;

    return {
      labels: primaryData.labels,
      datasets,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            max: primaryData.yMax,
            ticks: {
              stepSize: primaryData.interval
            },
            title: {
              display: true,
              text: primaryData.unit
            }
          },
          ...(secondaryData && {
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              max: secondaryData.yMax,
              ticks: {
                stepSize: secondaryData.interval
              },
              title: {
                display: true,
                text: secondaryData.unit
              },
              grid: {
                drawOnChartArea: false,
              },
            }
          })
        },
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    };
  };

  const config = getChartConfig();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Peternak</h1>

      {/* 5 Cards Row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Suhu Aktual</p>
          <p className="text-2xl font-bold text-gray-900">{sensorData.suhu}°C</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Kelembapan Aktual</p>
          <p className="text-2xl font-bold text-gray-900">{sensorData.kelembapan}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Kadar Amonia</p>
          <p className="text-2xl font-bold text-gray-900">{sensorData.amonia} ppm</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Status Kandang</p>
          <p className="text-2xl font-bold text-green-600">{sensorData.statusKandang}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Ringkasan (7 Hari)</p>
          <div className="space-y-1 text-xs">
            <p>Pakan: {reportSummary.totalPakan} kg</p>
            <p>Minum: {reportSummary.totalMinum} L</p>
            <p>Bobot: {reportSummary.rataBobot} kg</p>
            <p>Kematian: {reportSummary.totalKematian} ekor</p>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Grafik Analisis Laporan Kandang</h2>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Data 1:</label>
              <select
                value={selectedData1}
                onChange={(e) => setSelectedData1(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="pakan">Konsumsi Pakan</option>
                <option value="minum">Konsumsi Minum</option>
                <option value="bobot">Rata-rata Bobot</option>
                <option value="kematian">Jumlah Kematian</option>
              </select>
              <select
                value={chartType.data1}
                onChange={(e) => setChartType({ ...chartType, data1: e.target.value })}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="bar">Batang</option>
                <option value="line">Garis</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Data 2:</label>
              <select
                value={selectedData2}
                onChange={(e) => {
                  setSelectedData2(e.target.value);
                  if (e.target.value) {
                    setChartType({ ...chartType, data2: 'line' });
                  } else {
                    setChartType({ ...chartType, data2: null });
                  }
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tidak Ada</option>
                <option value="pakan">Konsumsi Pakan</option>
                <option value="minum">Konsumsi Minum</option>
                <option value="bobot">Rata-rata Bobot</option>
                <option value="kematian">Jumlah Kematian</option>
              </select>
              {selectedData2 && (
                <select
                  value={chartType.data2}
                  onChange={(e) => setChartType({ ...chartType, data2: e.target.value })}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bar">Batang</option>
                  <option value="line">Garis</option>
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="h-96">
          <Line data={config} options={config.options} />
        </div>
      </div>
    </div>
  );
}
