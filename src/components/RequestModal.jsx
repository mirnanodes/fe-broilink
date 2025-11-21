import React, { useState } from 'react';
import axiosInstance from '../utils/axios';

const RequestModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('kandang');
  const [formData, setFormData] = useState({
    farmName: '',
    farmArea: '',
    peternakId: '',
    peternakName: '',
    peternakPhone: ''
  });
  const [loading, setLoading] = useState(false);

  // Mock data peternak - nanti bisa diganti dengan fetch dari API
  const peternakList = [
    { id: 1, name: 'Budi Santoso' },
    { id: 2, name: 'Ahmad Wijaya' },
    { id: 3, name: 'Siti Nurhaliza' },
    { id: 4, name: 'Rudi Hermawan' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'kandang') {
        // Request untuk tambah kandang
        const selectedPeternak = peternakList.find(p => p.id === parseInt(formData.peternakId));
        const requestData = {
          type: 'Tambah Kandang',
          farm_name: formData.farmName,
          farm_area: formData.farmArea,
          peternak_id: formData.peternakId,
          peternak_name: selectedPeternak?.name || ''
        };

        await axiosInstance.post('/owner/request-farm', requestData);
      } else {
        // Request untuk tambah peternak
        const requestData = {
          type: 'Tambah Peternak',
          peternak_name: formData.peternakName,
          peternak_phone: formData.peternakPhone
        };

        await axiosInstance.post('/owner/request-peternak', requestData);
      }

      alert('Permintaan berhasil dikirim!');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Gagal mengirim permintaan!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-[420px] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ajukan Permintaan Owner</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('kandang')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'kandang'
                ? 'bg-[#3B82F6] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tambah Kandang
          </button>
          <button
            onClick={() => setActiveTab('peternak')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'peternak'
                ? 'bg-[#3B82F6] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tambah Peternak
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'kandang' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kandang</label>
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                  placeholder="Masukkan nama kandang"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Luas Kandang</label>
                <input
                  type="text"
                  value={formData.farmArea}
                  onChange={(e) => setFormData({ ...formData, farmArea: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                  placeholder="Masukkan luas kandang"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peternak yang mengurusi kandang</label>
                <select
                  value={formData.peternakId}
                  onChange={(e) => setFormData({ ...formData, peternakId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  required
                >
                  <option value="">Pilih peternak</option>
                  {peternakList.map((peternak) => (
                    <option key={peternak.id} value={peternak.id}>
                      {peternak.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap Peternak</label>
                <input
                  type="text"
                  value={formData.peternakName}
                  onChange={(e) => setFormData({ ...formData, peternakName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp Peternak</label>
                <input
                  type="tel"
                  value={formData.peternakPhone}
                  onChange={(e) => setFormData({ ...formData, peternakPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                  placeholder="Masukkan nomor WhatsApp"
                />
              </div>
            </>
          )}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 bg-[#3B82F6] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Mengirim...' : 'Kirim Permintaan'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-xs text-gray-500">
          Kelembapan: 70%
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
