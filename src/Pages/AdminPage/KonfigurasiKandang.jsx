import React, { useState, useEffect } from 'react';
import axiosInstance from "../../utils/axios";
import NavbarAdmin from '../../components/NavbarAdmin'; // ⬅️ Naik 2 level (..)
import SidebarAdmin from '../../components/SidebarAdmin';

// InputGroup di luar component agar tidak re-create setiap render
const InputGroup = ({ label, name, value, onChange, unit = '' }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <div className="relative">
      <input
        type="number"
        step="0.01"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
        required
      />
      {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit}</span>}
    </div>
  </div>
);

const KonfigurasiKandang = () => {
  const [config, setConfig] = useState({
    temp_min_normal: '', temp_max_normal: '', temp_min_critical: '', temp_max_critical: '',
    humidity_min_normal: '', humidity_max_normal: '', humidity_min_critical: '', humidity_max_critical: '',
    ammonia_max_normal: '', ammonia_critical: '',
    weight_min_weekly: '', weight_target: '', initial_weight: '',
    feed_min_normal: '', water_min_normal: '',
    initial_population: '', farm_area: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedKandang, setSelectedKandang] = useState('1');

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    const defaultConfig = {
      temp_min_normal: '', temp_max_normal: '', temp_min_critical: '', temp_max_critical: '',
      humidity_min_normal: '', humidity_max_normal: '', humidity_min_critical: '', humidity_max_critical: '',
      ammonia_max_normal: '', ammonia_critical: '',
      weight_min_weekly: '', weight_target: '', initial_weight: '',
      feed_min_normal: '', water_min_normal: '',
      initial_population: '', farm_area: '',
    };
    try {
      const response = await axiosInstance.get('/api/admin/farm-config');
      console.log('Response config:', response.data);
      setConfig(response.data.data || defaultConfig);
    } catch (error) {
      console.error('Error fetching config:', error.response || error.message);
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put('/api/admin/farm-config', config);
      setModalMessage('Konfigurasi berhasil disimpan!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving config:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan konfigurasi');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      await axiosInstance.post('/api/admin/farm-config/reset');
      setModalMessage('Konfigurasi berhasil direset ke default!');
      setShowResetModal(false);
      setShowSuccessModal(true);
      fetchConfig();
    } catch (error) {
      console.error('Error resetting config:', error);
      alert(error.response?.data?.message || 'Gagal reset konfigurasi');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarAdmin /><SidebarAdmin />
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
      <NavbarAdmin /><SidebarAdmin />
      <main className="ml-48 pt-24">
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
          {/* Header dengan Dropdown */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Konfigurasi Kandang</h1>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Pilih Kandang:</label>
              <select
                value={selectedKandang}
                onChange={(e) => setSelectedKandang(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="1">Kandang 1</option>
                <option value="2">Kandang 2</option>
                <option value="3">Kandang 3</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 2 Column Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                {/* Temperature */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Suhu</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Min Normal (°C)" name="temp_min_normal" value={config.temp_min_normal} onChange={handleInputChange} unit="°C" />
                    <InputGroup label="Max Normal (°C)" name="temp_max_normal" value={config.temp_max_normal} onChange={handleInputChange} unit="°C" />
                    <InputGroup label="Min Kritis (°C)" name="temp_min_critical" value={config.temp_min_critical} onChange={handleInputChange} unit="°C" />
                    <InputGroup label="Max Kritis (°C)" name="temp_max_critical" value={config.temp_max_critical} onChange={handleInputChange} unit="°C" />
                  </div>
                </div>

                {/* Ammonia */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Kadar Amonia</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Max Normal (ppm)" name="ammonia_max_normal" value={config.ammonia_max_normal} onChange={handleInputChange} unit="ppm" />
                    <InputGroup label="Kritis (ppm)" name="ammonia_critical" value={config.ammonia_critical} onChange={handleInputChange} unit="ppm" />
                  </div>
                </div>

                {/* Feed */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Pakan</h2>
                  <InputGroup label="Min Normal (gram)" name="feed_min_normal" value={config.feed_min_normal} onChange={handleInputChange} unit="g" />
                </div>

                {/* Population */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Populasi Awal</h2>
                  <InputGroup label="Jumlah (ekor)" name="initial_population" value={config.initial_population} onChange={handleInputChange} unit="ekor" />
                </div>

                {/* Area */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Luas Kandang</h2>
                  <InputGroup label="Luas (m²)" name="farm_area" value={config.farm_area} onChange={handleInputChange} unit="m²" />
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* Humidity */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Kelembapan</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Min Normal (%)" name="humidity_min_normal" value={config.humidity_min_normal} onChange={handleInputChange} unit="%" />
                    <InputGroup label="Max Normal (%)" name="humidity_max_normal" value={config.humidity_max_normal} onChange={handleInputChange} unit="%" />
                    <InputGroup label="Min Kritis (%)" name="humidity_min_critical" value={config.humidity_min_critical} onChange={handleInputChange} unit="%" />
                    <InputGroup label="Max Kritis (%)" name="humidity_max_critical" value={config.humidity_max_critical} onChange={handleInputChange} unit="%" />
                  </div>
                </div>

                {/* Weight */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Bobot</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Min/Minggu (g)" name="weight_min_weekly" value={config.weight_min_weekly} onChange={handleInputChange} unit="g" />
                    <InputGroup label="Target Panen (g)" name="weight_target" value={config.weight_target} onChange={handleInputChange} unit="g" />
                  </div>
                </div>

                {/* Water */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Minum</h2>
                  <InputGroup label="Min Normal (liter)" name="water_min_normal" value={config.water_min_normal} onChange={handleInputChange} unit="L" />
                </div>

                {/* Initial Weight */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Bobot Rata-rata Awal</h2>
                  <InputGroup label="Bobot (gram)" name="initial_weight" value={config.initial_weight || ''} onChange={handleInputChange} unit="g" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => setShowResetModal(true)}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Reset ke Default
              </button>
              <button type="submit" disabled={saving}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-400">
                {saving ? 'Menyimpan...' : 'Simpan ke Konfigurasi'}
              </button>
            </div>
          </form>

          {/* Reset Modal */}
          {showResetModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Reset</h3>
                <p className="text-gray-600 mb-6">Apakah Anda yakin ingin mereset semua konfigurasi ke nilai default?</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowResetModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
                  <button onClick={handleReset}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Reset</button>
                </div>
              </div>
            </div>
          )}

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil!</h3>
                <p className="text-gray-600 mb-6">{modalMessage}</p>
                <button onClick={() => setShowSuccessModal(false)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">OK</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default KonfigurasiKandang;
