import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { handleError } from '../../utils/errorHandler';
import NavbarAdmin from '../../components/NavbarAdmin';
import SidebarAdmin from '../../components/SidebarAdmin';

const RiwayatLaporan = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('Terbaru');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [currentPage, filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const sortOrder = filter === 'Terbaru' ? 'newest' : 'oldest';
      const response = await adminService.getRequests(sortOrder, currentPage);
      const data = response.data.data || response.data;
      setRequests(data.requests || data || []);
    } catch (error) {
      const errorMessage = handleError('RiwayatLaporan fetchRequests', error);
      console.error(errorMessage);
      // Fallback to mock data when API fails
      setRequests([
        {
          id: 1,
          name: 'Budi Santoso',
          role: 'Owner',
          user: { name: 'Budi Santoso', role: { name: 'Owner' } },
          phone: '+62812-3456-7890',
          whatsapp: '+62812-3456-7890',
          created_at: '2025-11-20T14:30:00Z',
          request_type: 'Permintaan reset password',
          detail: 'Permintaan reset password',
          status: 'menunggu'
        },
        {
          id: 2,
          name: 'Siti Aminah',
          role: 'Peternak',
          user: { name: 'Siti Aminah', role: { name: 'Peternak' } },
          phone: '+62813-9876-5432',
          whatsapp: '+62813-9876-5432',
          created_at: '2025-11-20T11:15:00Z',
          request_type: 'Laporan error sistem',
          detail: 'Laporan error sistem',
          status: 'diproses'
        },
        {
          id: 3,
          name: 'Andi Wijaya',
          role: 'Owner',
          user: { name: 'Andi Wijaya', role: { name: 'Owner' } },
          phone: '+62815-2468-1357',
          whatsapp: '+62815-2468-1357',
          created_at: '2025-11-19T09:45:00Z',
          request_type: 'Permintaan akses kandang baru',
          detail: 'Permintaan akses kandang baru',
          status: 'selesai'
        },
        {
          id: 4,
          name: 'Dewi Lestari',
          role: 'Peternak',
          user: { name: 'Dewi Lestari', role: { name: 'Peternak' } },
          phone: '+62817-5555-8888',
          whatsapp: '+62817-5555-8888',
          created_at: '2025-11-18T16:20:00Z',
          request_type: 'Pertanyaan teknis',
          detail: 'Pertanyaan teknis',
          status: 'selesai'
        },
        {
          id: 5,
          name: 'Rudi Hartono',
          role: 'Guest',
          user: { name: 'Rudi Hartono', role: { name: 'Guest' } },
          phone: '+62819-1111-2222',
          whatsapp: '+62819-1111-2222',
          created_at: '2025-11-18T10:00:00Z',
          request_type: 'Masalah login',
          detail: 'Masalah login',
          status: 'ditolak'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (logId, newStatus) => {
    try {
      await adminService.updateRequestStatus(logId, newStatus);
      fetchRequests();
      setShowDetailModal(false);
    } catch (error) {
      const errorMessage = handleError('RiwayatLaporan handleStatusUpdate', error);
      alert('Gagal mengupdate status: ' + errorMessage);
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
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-gray-500">
                        <p>Belum ada laporan</p>
                      </td>
                    </tr>
                  ) : (
                    requests.map((log, index) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-900">{(currentPage - 1) * 5 + index + 1}</td>
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
                disabled={requests.length < 5}
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
