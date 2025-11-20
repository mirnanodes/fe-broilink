import React, { useState, useEffect } from 'react';
import axiosInstance from "../../utils/axios";
import { USE_MOCK_DATA } from '../../config/api';
import NavbarAdmin from '../../components/NavbarAdmin';
import SidebarAdmin from '../../components/SidebarAdmin';

const mockConfig = {
  suhu_normal_min: 28,
  suhu_normal_max: 32,
  suhu_kritis_rendah: 25,
  suhu_kritis_tinggi: 35,
  kelembapan_normal_min: 60,
  kelembapan_normal_max: 70,
  kelembapan_kritis_rendah: 50,
  kelembapan_kritis_tinggi: 80,
  amonia_max: 20,
  amonia_kritis: 30,
  bobot_pertumbuhan_min: 100,
  bobot_target: 2000,
  pakan_min: 50,
  minum_min: 100,
  populasi_awal: 1000,
  bobot_awal: 40,
  luas_kandang: 100,
  peternak_id: 2
};

const mockFarms = [
  { farm_id: 1, name: 'Kandang Sleman' },
  { farm_id: 2, name: 'Kandang Bantul' }
];

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
  const [config, setConfig] = useState(mockConfig);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedKandang, setSelectedKandang] = useState('1');
  const [hasDefault, setHasDefault] = useState(false);

  useEffect(() => {
    const defaultConfig = localStorage.getItem('defaultConfig');
    setHasDefault(!!defaultConfig);
    if (!USE_MOCK_DATA) {
      fetchConfig();
    }
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/farm-config');
      setConfig(response.data.data || mockConfig);
    } catch (error) {
      console.error('Error fetching config:', error);
      setConfig(mockConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!hasDefault) {
      localStorage.setItem('defaultConfig', JSON.stringify(config));
      setHasDefault(true);
    }

    if (USE_MOCK_DATA) {
      setModalMessage('Konfigurasi berhasil disimpan! (mock)');
      setShowSuccessModal(true);
      setSaving(false);
      return;
    }

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
    const defaultConfig = localStorage.getItem('defaultConfig');
    if (!defaultConfig) {
      alert('Belum ada konfigurasi default yang disimpan');
      return;
    }

    if (USE_MOCK_DATA) {
      setConfig(JSON.parse(defaultConfig));
      setModalMessage('Konfigurasi berhasil direset ke default! (mock)');
      setShowResetModal(false);
      setShowSuccessModal(true);
      return;
    }

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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Konfigurasi Kandang</h1>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Pilih Kandang:</label>
              <select
                value={selectedKandang}
                onChange={(e) => setSelectedKandang(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {mockFarms.map(farm => (
                  <option key={farm.farm_id} value={farm.farm_id}>{farm.name}</option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Suhu</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Min Normal (°C)" name="suhu_normal_min" value={config.suhu_normal_min} onChange={handleInputChange} unit="°C" />
                    <InputGroup label="Max Normal (°C)" name="suhu_normal_max" value={config.suhu_normal_max} onChange={handleInputChange} unit="°C" />
                    <InputGroup label="Min Kritis (°C)" name="suhu_kritis_rendah" value={config.suhu_kritis_rendah} onChange={handleInputChange} unit="°C" />
                    <InputGroup label="Max Kritis (°C)" name="suhu_kritis_tinggi" value={config.suhu_kritis_tinggi} onChange={handleInputChange} unit="°C" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Kadar Amonia</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Max Normal (ppm)" name="amonia_max" value={config.amonia_max} onChange={handleInputChange} unit="ppm" />
                    <InputGroup label="Kritis (ppm)" name="amonia_kritis" value={config.amonia_kritis} onChange={handleInputChange} unit="ppm" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Pakan</h2>
                  <InputGroup label="Min Normal (gram)" name="pakan_min" value={config.pakan_min} onChange={handleInputChange} unit="g" />
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Populasi Awal</h2>
                  <InputGroup label="Jumlah (ekor)" name="populasi_awal" value={config.populasi_awal} onChange={handleInputChange} unit="ekor" />
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Luas Kandang</h2>
                  <InputGroup label="Luas (m²)" name="luas_kandang" value={config.luas_kandang} onChange={handleInputChange} unit="m²" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Kelembapan</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Min Normal (%)" name="kelembapan_normal_min" value={config.kelembapan_normal_min} onChange={handleInputChange} unit="%" />
                    <InputGroup label="Max Normal (%)" name="kelembapan_normal_max" value={config.kelembapan_normal_max} onChange={handleInputChange} unit="%" />
                    <InputGroup label="Min Kritis (%)" name="kelembapan_kritis_rendah" value={config.kelembapan_kritis_rendah} onChange={handleInputChange} unit="%" />
                    <InputGroup label="Max Kritis (%)" name="kelembapan_kritis_tinggi" value={config.kelembapan_kritis_tinggi} onChange={handleInputChange} unit="%" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Bobot</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Min/Minggu (g)" name="bobot_pertumbuhan_min" value={config.bobot_pertumbuhan_min} onChange={handleInputChange} unit="g" />
                    <InputGroup label="Target Panen (g)" name="bobot_target" value={config.bobot_target} onChange={handleInputChange} unit="g" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Minum</h2>
                  <InputGroup label="Min Normal (liter)" name="minum_min" value={config.minum_min} onChange={handleInputChange} unit="L" />
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Bobot Rata-rata Awal</h2>
                  <InputGroup label="Bobot (gram)" name="bobot_awal" value={config.bobot_awal || ''} onChange={handleInputChange} unit="g" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                disabled={!hasDefault}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Reset ke Default
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-400"
              >
                {saving ? 'Menyimpan...' : 'Simpan ke Konfigurasi'}
              </button>
            </div>
          </form>

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
