import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from "../../utils/axios";
import { USE_MOCK_DATA } from '../../config/api';
import NavbarAdmin from '../../components/NavbarAdmin';
import SidebarAdmin from '../../components/SidebarAdmin';

const mockDashboard = {
  total_owners: 2,
  total_peternak: 4,
  pending_requests: 3,
  recent_requests: [
    { id: 1, name: 'owner1', role: 'Owner', created_at: '15 Mei 2025, 18.30', type: 'Tambah Kandang' },
    { id: 2, name: 'guest', role: '-', created_at: '15 Mei 2025, 17.20', type: '-' },
    { id: 3, name: 'owner2', role: 'Owner', created_at: '14 Mei 2025, 10.15', type: 'Tambah Peternak' }
  ]
};

const DashboardAdmin = () => {
  const [stats, setStats] = useState(mockDashboard);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/dashboard');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error.response || error.message);
      setStats(mockDashboard);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, color = 'blue' }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-sm font-medium text-gray-600 mb-3 text-center">{title}</h3>
      <p className={`text-4xl font-bold text-${color}-500 text-center`}>{value}</p>
    </div>
  );

  const RequestCard = ({ request }) => {
    const roleName = request.role || (request.user?.role?.name) || 'Guest';
    const userName = request.name || request.user?.name || (roleName === 'Guest' ? 'Guest' : 'Nama Tidak Tersedia');
    const displayTime = request.created_at || 'undefined';
    const requestType = request.type || request.request_type || '-';

    return (
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow hover:shadow-lg transition-all">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{userName}</h4>
              <span className="text-xs text-gray-500">{roleName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{displayTime}</span>
            </div>
            <p className="text-sm text-gray-700">{requestType}</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarAdmin />
        <SidebarAdmin />
        <main className="ml-48 pt-24 px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAdmin />
      <SidebarAdmin />
      <main className="ml-48 pt-24">
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
          <div className="grid grid-cols-3 gap-8">
            <StatCard title="Total Pengguna Owner" value={stats.total_owners} color="blue" />
            <StatCard title="Total Pengguna Peternak" value={stats.total_peternak} color="blue" />
            <StatCard title="Total Laporan Guest" value={stats.pending_requests} color="blue" />
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Permintaan Terbaru</h2>
              <Link
                to="/riwayat-laporan"
                className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1"
              >
                Lihat Semua Laporan
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {stats.recent_requests?.length > 0 ? (
              <div className="grid grid-cols-3 gap-6">
                {stats.recent_requests.slice(0, 3).map((request, index) => (
                  <RequestCard key={request.id || index} request={request} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>Belum ada permintaan terbaru</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
