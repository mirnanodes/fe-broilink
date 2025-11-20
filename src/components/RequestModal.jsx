import React, { useState } from 'react';
import ownerService from '../services/ownerService';

const RequestModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('kandang');
  const [formData, setFormData] = useState({
    farmName: '',
    farmLocation: '',
    farmArea: '',
    peternakName: '',
    peternakPhone: '',
    peternakEmail: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestData = {
        type: activeTab === 'kandang' ? 'Tambah Kandang' : 'Tambah Peternak',
        detail: activeTab === 'kandang'
          ? `Kandang: ${formData.farmName}, Lokasi: ${formData.farmLocation}, Luas: ${formData.farmArea} m²`
          : `Peternak: ${formData.peternakName}, HP: ${formData.peternakPhone}, Email: ${formData.peternakEmail}`
      };

      await ownerService.submitRequest(requestData);
      alert('Permintaan berhasil dikirim!');
      onClose();
    } catch (error) {
      alert('Gagal mengirim permintaan!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[480px]">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pengajuan Permintaan</h3>

        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('kandang')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'kandang'
                ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tambah Kandang
          </button>
          <button
            onClick={() => setActiveTab('peternak')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'peternak'
                ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
                : 'text-gray-600 hover:text-gray-900'
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Kandang</label>
                <input
                  type="text"
                  value={formData.farmLocation}
                  onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Luas Kandang (m²)</label>
                <input
                  type="number"
                  value={formData.farmArea}
                  onChange={(e) => setFormData({ ...formData, farmArea: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp</label>
                <input
                  type="tel"
                  value={formData.peternakPhone}
                  onChange={(e) => setFormData({ ...formData, peternakPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.peternakEmail}
                  onChange={(e) => setFormData({ ...formData, peternakEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : 'Kirim Permintaan'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;
