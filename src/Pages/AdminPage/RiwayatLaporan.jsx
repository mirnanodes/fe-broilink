import React, { useState, useEffect } from 'react';
import axiosInstance from "../../utils/axios";
import { USE_MOCK_DATA } from '../../config/api';
import NavbarAdmin from '../../components/NavbarAdmin';
import SidebarAdmin from '../../components/SidebarAdmin';

const mockRequests = [
  {
    id: 1,
    name: 'owner1',
    role: 'Owner',
    phone: '081234567890',
    created_at: '2025-11-17T10:30:00',
    request_type: 'Tambah Kandang',
    status: 'menunggu'
  },
  {
    id: 2,
    name: 'guest',
    role: '-',
    phone: '081298765432',
    created_at: '2025-11-17T09:15:00',
    request_type: '-',
    status: 'menunggu'
  },
  {
    id: 3,
    name: 'owner2',
    role: 'Owner',
    phone: '081234123456',
    created_at: '2025-11-16T14:20:00',
    request_type: 'Tambah Peternak',
    status: 'diproses'
  },
  {
    id: 4,
    name: 'peternak1',
    role: 'Peternak',
    phone: '081298123456',
    created_at: '2025-11-16T11:45:00',
    request_type: 'Update Data',
    status: 'selesai'
  },
  {
    id: 5,
    name: 'guest',
    role: '-',
    phone: '081234999888',
    created_at: '2025-11-15T16:30:00',
    request_type: '-',
    status: 'menunggu'
  }
];

const RiwayatLaporan = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('Terbaru');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      fetchRequests();
    }
  }, [currentPage, filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const sortOrder = filter === 'Terbaru' ? 'desc' : 'asc';
      const response = await axiosInstance.get(('/admin/requests', {
        params: { page: currentPage, sort: sortOrder }
      });
      setRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching Requests:', error);
      setRequests(mockRequests);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (logId, newStatus) => {
    if (USE_MOCK_DATA) {
      setRequests(prev => prev.map(r => r.id === logId ? { ...r, status: newStatus } : r));
      setShowDetailModal(false);
      return;
    }
    try {
      await axiosInstance.put(`/api/admin/requests/${logId}/status`, { status: newStatus });
      fetchRequests();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Gagal mengupdate status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'menunggu': 'bg-yellow-100 text-yellow-700',
      'diproses': 'bg-blue-100 text-blue-700',
      'selesai': 'bg-green-100 text-green-700',
      'ditolak': 'bg-red-100 text-red-700',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const sortedRequests = [...requests].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return filter === 'Terbaru' ? dateB - dateA : dateA - dateB;
  });

  const paginatedRequests = sortedRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarAdmin /><SidebarAdmin />
        <main className="ml-48 pt-16 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAdmin /><SidebarAdmin />
      <main className="ml-48 pt-16 p-8">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Riwayat Laporan & Permintaan</h1>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">Log semua permintaan yang dikirimkan oleh pengguna sistem</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Urutkan:</span>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                  <option>Terbaru</option>
                  <option>Terlama</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NO</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Username</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">WhatsApp</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Waktu</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Detail Permintaan</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedRequests.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-gray-500">
                        <p>Belum ada laporan</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedRequests.map((log, index) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-900">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{log.name || log.user?.name || 'Guest'}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{log.role || log.user?.role?.name || '—'}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{log.phone || log.whatsapp || '—'}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {log.created_at ? formatDateTime(log.created_at) : '—'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{log.request_type || log.detail || '—'}</td>
                        <td className="px-4 py-4">
                          <button onClick={() => { setSelectedLog(log); setShowDetailModal(true); }} className="relative group">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                              {log.status}
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {currentPage}
              </button>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage * itemsPerPage >= sortedRequests.length}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {currentPage + 1}
              </button>
              <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {showDetailModal && selectedLog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Detail Permintaan</h3>
                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-sm text-gray-600">Nama:</span>
                    <p className="font-medium text-gray-900">{selectedLog.name || selectedLog.user?.name || 'Guest'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Role:</span>
                    <p className="font-medium text-gray-900">{selectedLog.role || selectedLog.user?.role?.name || '—'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">WhatsApp:</span>
                    <p className="font-medium text-gray-900">{selectedLog.phone || selectedLog.whatsapp || '—'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Jenis Permintaan:</span>
                    <p className="font-medium text-gray-900">{selectedLog.request_type || selectedLog.detail || '—'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Waktu:</span>
                    <p className="font-medium text-gray-900">{selectedLog.created_at ? new Date(selectedLog.created_at).toLocaleString('id-ID') : '—'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status Saat Ini:</span>
                    <p className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Ubah Status:</p>
                  {['menunggu', 'diproses', 'selesai', 'ditolak'].map((status) => (
                    <button key={status} onClick={() => handleStatusUpdate(selectedLog.id, status)}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedLog.status.toLowerCase() === status ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>

                <button onClick={() => setShowDetailModal(false)}
                  className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RiwayatLaporan;
