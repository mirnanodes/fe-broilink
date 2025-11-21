import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import RequestModal from '../../components/RequestModal';

const Dashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('Mortalitas');
  const [showRequestModal, setShowRequestModal] = useState(false);

  const [farmData, setFarmData] = useState({
    name: 'Kandang A',
    status: 'Waspada',
    temp: '35°C'
  });

  const [activities, setActivities] = useState([
    { time: '18.30', activity: 'Update Indikator', detail: 'Kelembapan: 70%', status: 'Normal' },
    { time: '17.56', activity: 'Laporan Minum', detail: 'oleh Budi', status: 'Info' },
    { time: '12.45', activity: 'Laporan Pakan', detail: 'oleh Budi', status: 'Info' },
    { time: '08.00', activity: 'Update Indikator', detail: 'Suhu: 35°C', status: 'Waspada' },
    { time: '07.30', activity: 'Update Indikator', detail: 'Suhu: 35,1°C', status: 'Bahaya' }
  ]);

  const chartData = [
    { time: '00:00', value: 4 },
    { time: '12:00', value: 5 },
    { time: '18:00', value: 2 },
    { time: '06:00', value: 3 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/owner/dashboard');
        const data = response.data.data;

        if (data.farms && data.farms.length > 0) {
          const firstFarm = data.farms[0];
          setFarmData({
            name: firstFarm.farm_name,
            status: firstFarm.status,
            temp: firstFarm.latest_sensor ? `${firstFarm.latest_sensor.temperature}°C` : '35°C'
          });
        }

        if (data.recent_reports && data.recent_reports.length > 0) {
          const acts = data.recent_reports.map(r => ({
            time: new Date(r.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
            activity: 'Laporan Manual',
            detail: `Pakan: ${r.konsumsi_pakan}kg`,
            status: 'Info'
          }));
          setActivities(acts);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

  const handlePengajuan = () => {
    setShowRequestModal(true);
  };

  const getStatusBadgeClass = (status) => {
    const baseClass = "inline-block px-3 py-1 rounded-full text-xs font-medium";
    const statusClasses = {
      normal: "bg-green-100 text-green-800",
      info: "bg-blue-100 text-blue-800",
      waspada: "bg-yellow-100 text-yellow-800",
      bahaya: "bg-red-100 text-red-800"
    };
    return `${baseClass} ${statusClasses[status.toLowerCase()] || statusClasses.info}`;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Owner</h1>
          <p className="text-gray-500 text-sm mt-1">Pantau kondisi semua kandang dan aktivitas peternakan Anda</p>
        </div>
        <button
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          onClick={handlePengajuan}
        >
          <span className="text-xl font-semibold">+</span>
          Pengajuan Permintaan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Kondisi Kandang Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Kondisi Kandang</h2>
          <div className="text-center py-4">
            <div className="mx-auto mb-4 w-20">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="40" fill="#FFD700"/>
                <path d="M40 18 L60 58 L20 58 Z" fill="#fff"/>
                <path d="M38 32 L42 32 L41.5 45 L38.5 45 Z" fill="#FFD700"/>
                <circle cx="40" cy="50" r="2.5" fill="#FFD700"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 my-2">{farmData.name}</h3>
            <p className="text-base font-semibold text-yellow-600 my-1">{farmData.status}</p>
            <p className="text-2xl font-bold text-red-500 my-2">{farmData.temp}</p>
          </div>
        </div>

        {/* Analisis Laporan Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Analisis Laporan (Terbaru)</h2>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option>Mortalitas</option>
              <option>Bobot</option>
              <option>Pakan</option>
              <option>Minum</option>
            </select>
          </div>
          <div className="flex gap-4 h-72">
            {/* Y Axis */}
            <div className="flex flex-col justify-between text-xs text-gray-500 py-4">
              <span>6</span>
              <span>4</span>
              <span>2</span>
              <span>0</span>
            </div>
            {/* Chart Area */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex items-end gap-8 p-4 border-l-2 border-b-2 border-gray-300">
                {chartData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t min-h-[20px] flex items-start justify-center pt-1"
                      style={{ height: `${(data.value / 6) * 100}%` }}
                    >
                      <span className="text-xs font-semibold text-white">{data.value}</span>
                    </div>
                    <span className="text-xs text-gray-600">{data.time}</span>
                  </div>
                ))}
              </div>
              <div className="text-center text-xs text-gray-500 font-medium mt-2">Jam</div>
            </div>
            {/* Y Label */}
            <div className="flex items-center">
              <span className="text-xs text-gray-500 font-medium" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                Ekor
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Table Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Peternakan</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aktivitas</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-gray-500 text-sm">{activity.time}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-gray-900">{activity.activity}</span>
                      <span className="text-sm text-gray-500">{activity.detail}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={getStatusBadgeClass(activity.status)}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showRequestModal && (
        <RequestModal onClose={() => setShowRequestModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;
