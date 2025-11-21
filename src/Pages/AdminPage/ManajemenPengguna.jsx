import React, { useState, useEffect } from 'react';
import axiosInstance from "../../utils/axios";
import { USE_MOCK_DATA } from '../../config/api';
import NavbarAdmin from '../../components/NavbarAdmin';
import SidebarAdmin from '../../components/SidebarAdmin';

const mockUsers = [
  {
    user_id: 1,
    username: 'owner1',
    name: 'owner1',
    role: { name: 'Owner' },
    role_id: 2,
    date_joined: '2024-01-15',
    last_login: '2025-11-17',
    email: 'owner1@mail.com',
    phone_number: '081234567890'
  },
  {
    user_id: 2,
    username: 'peternak1',
    name: 'peternak1',
    role: { name: 'Peternak' },
    role_id: 3,
    date_joined: '2024-02-20',
    last_login: '2025-10-01',
    email: 'peternak1@mail.com',
    phone_number: '081298765432'
  }
];

const mockStats = { total: 2, owner: 1, peternak: 1 };

const ManajemenPengguna = () => {
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState(mockStats);
  const [activeTab, setActiveTab] = useState('peternak');
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [owners, setOwners] = useState([]);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role_id: '',
    phone_number: '',
    status: 'active',
    farm_id: '',
    owner_id: '',
    farm_name: '',
    location: '',
    farm_area: '',
  });

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      fetchUsers();
      fetchOwners();
    }
  }, [currentPage]);

  const calculateStatus = (lastLogin) => {
    if (!lastLogin) return 'nonaktif';
    const now = new Date();
    const loginDate = new Date(lastLogin);
    const diffDays = Math.floor((now - loginDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 ? 'aktif' : 'nonaktif';
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(('/admin/users', {
        params: { page: currentPage }
      });
      const data = response.data.data;
      setUsers(data.users || []);
      setStats(data.stats || mockStats);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers(mockUsers);
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      if (!USE_MOCK_DATA) fetchUsers();
      else setUsers(mockUsers);
      return;
    }
    if (USE_MOCK_DATA) {
      const filtered = mockUsers.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUsers(filtered);
      return;
    }
    try {
      const response = await axiosInstance.get(('/admin/users', {
        params: { search: searchQuery }
      });
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
      setUsers([]);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await axiosInstance.get(('/admin/users', {
        params: { role: 'Owner' }
      });
      setOwners(response.data.data.users || []);
    } catch (error) {
      console.error('Error fetching owners:', error);
      setOwners([]);
    }
  };

  const openAddFarmModal = (owner) => {
    setSelectedOwner(owner);
    setShowAddFarmModal(true);
  };

  const handleAddFarm = async (e) => {
    e.preventDefault();
    if (USE_MOCK_DATA) {
      alert('Kandang berhasil ditambahkan! (mock)');
      setShowAddFarmModal(false);
      setSelectedOwner(null);
      return;
    }
    const formData = new FormData(e.target);
    try {
      await axiosInstance.post(('/admin/farms', {
        owner_id: selectedOwner.user_id,
        farm_name: formData.get('farm_name'),
        location: formData.get('location'),
        initial_population: formData.get('initial_population') || null,
        farm_area: formData.get('farm_area') || null,
      });
      alert('Kandang berhasil ditambahkan!');
      setShowAddFarmModal(false);
      setSelectedOwner(null);
    } catch (error) {
      console.error('Error adding farm:', error);
      alert('Gagal menambah kandang: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (USE_MOCK_DATA) {
      alert('Berhasil! (mock)');
      setShowModal(false);
      resetForm();
      return;
    }
    try {
      if (modalType === 'add') {
        const payload = {
          username: formData.username,
          name: formData.name,
          password: formData.password,
          phone_number: formData.phone_number,
          status: formData.status,
        };

        if (activeTab === 'owner') {
          payload.role_id = 2;
          payload.email = formData.email;
          if (formData.farm_name) {
            payload.farm_name = formData.farm_name;
            payload.location = formData.location;
            payload.farm_area = formData.farm_area;
          }
        } else {
          payload.role_id = 3;
          payload.owner_id = formData.owner_id;
        }

        await axiosInstance.post(('/admin/users', payload);
      } else if (modalType === 'edit') {
        await axiosInstance.put(`/api/admin/users/${selectedUser.user_id}`, formData);
      }

      setShowModal(false);
      fetchUsers();
      resetForm();
      alert('Berhasil!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async () => {
    if (USE_MOCK_DATA) {
      alert('User berhasil dihapus! (mock)');
      setShowModal(false);
      return;
    }
    try {
      await axiosInstance.delete(`/api/admin/users/${selectedUser.user_id}`);
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      name: '',
      email: '',
      password: '',
      role_id: '',
      phone_number: '',
      status: 'active',
      farm_id: '',
      owner_id: '',
      farm_name: '',
      location: '',
      farm_area: '',
    });
    setSelectedUser(null);
    setActiveTab('peternak');
  };

  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    if (user && type === 'edit') {
      setFormData({
        username: user.username || '',
        name: user.name,
        email: user.email,
        password: '',
        role_id: user.role_id,
        phone_number: user.phone_number || '',
        status: user.status || 'active',
        farm_id: user.farm_id || '',
        owner_id: '',
        farm_name: '',
        location: '',
        farm_area: '',
      });
    } else {
      setActiveTab('peternak');
    }
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAdmin />
      <SidebarAdmin />
      <main className="ml-48 pt-24">
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengguna</h1>

          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">Total Pengguna</h3>
              <p className="text-4xl font-bold text-blue-500 text-center">{stats.total}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">Total Pengguna Owner</h3>
              <p className="text-4xl font-bold text-blue-500 text-center">{stats.owner}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">Total Pengguna Peternak</h3>
              <p className="text-4xl font-bold text-blue-500 text-center">{stats.peternak}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Daftar Pengguna ({users.length})</h2>

            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cari User</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Masukkan nama atau email pengguna..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cari
                  </button>
                </div>
              </div>
              <button
                onClick={() => openModal('add')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Tambahkan Akun
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Username</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal Bergabung</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Login Terakhir</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-12 text-gray-500">
                            <p>Tidak ada data pengguna</p>
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => {
                          const status = calculateStatus(user.last_login);
                          return (
                            <tr key={user.user_id || user.id} className="hover:bg-blue-50 transition-colors">
                              <td className="px-4 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                              <td className="px-4 py-4 text-sm text-gray-600">{user.role?.name || 'N/A'}</td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                  status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-600">
                                {user.date_joined || '—'}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-600">
                                {user.last_login || '—'}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  {user.role?.name === 'Owner' && (
                                    <button
                                      onClick={() => openAddFarmModal(user)}
                                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                      title="Tambah Kandang"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                    </button>
                                  )}

                                  <button
                                    onClick={() => openModal('edit', user)}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    </svg>
                                  </button>

                                  <button
                                    onClick={() => openModal('delete', user)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
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
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {currentPage + 1}
                  </button>
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
                {modalType === 'delete' ? (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Penghapusan</h3>
                    <p className="text-gray-600 mb-6">
                      Apakah Anda yakin ingin menghapus akun <strong>{selectedUser?.name}</strong>?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {modalType === 'add' ? 'Tambah Akun Baru' : 'Edit Akun'}
                    </h3>

                    {modalType === 'add' && (
                      <div className="flex gap-2 mb-6 border-b">
                        <button
                          type="button"
                          onClick={() => setActiveTab('peternak')}
                          className={`px-4 py-2 ${activeTab === 'peternak' ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : 'text-gray-500'}`}
                        >
                          Tambahkan Peternak
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('owner')}
                          className={`px-4 py-2 ${activeTab === 'owner' ? 'border-b-2 border-blue-500 text-blue-500 font-medium' : 'text-gray-500'}`}
                        >
                          Tambahkan Owner
                        </button>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {modalType === 'add' ? (
                        activeTab === 'peternak' ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap Peternak</label>
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nama Lengkap Peternak"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                              <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="Username"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                              <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Owner</label>
                              <select
                                value={formData.owner_id}
                                onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              >
                                <option value="">Peternak ini akan ditugaskan ke Owner tertentu, pilih Owner.</option>
                                {owners.map(o => (
                                  <option key={o.user_id} value={o.user_id}>{o.name}</option>
                                ))}
                              </select>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap Owner</label>
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nama Lengkap Owner"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                              <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="Username"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                              <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kandang (opsional)</label>
                              <input
                                type="text"
                                value={formData.farm_name}
                                onChange={(e) => setFormData({ ...formData, farm_name: e.target.value })}
                                placeholder="Kandang Broiler 1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </>
                        )
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                              type="text"
                              value={formData.username}
                              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                            <input
                              type="text"
                              value={formData.phone_number}
                              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password (Kosongkan jika tidak ingin mengubah)</label>
                            <input
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                              value={formData.role_id}
                              onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              required
                            >
                              <option value="">Pilih Role</option>
                              <option value="2">Owner</option>
                              <option value="3">Peternak</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                              value={formData.status}
                              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              required
                            >
                              <option value="active">Aktif</option>
                              <option value="inactive">Nonaktif</option>
                            </select>
                          </div>
                        </>
                      )}
                      <div className="flex gap-3 mt-6">
                        <button
                          type="button"
                          onClick={() => { setShowModal(false); resetForm(); }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          {modalType === 'add' ? 'Tambah' : 'Simpan'}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}

          {showAddFarmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Tambah Kandang untuk: {selectedOwner?.name}
                </h3>

                <form onSubmit={handleAddFarm} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kandang</label>
                    <input
                      type="text"
                      name="farm_name"
                      placeholder="Kandang Broiler 1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Yogyakarta"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Populasi Awal (ekor)</label>
                    <input
                      type="number"
                      name="initial_population"
                      placeholder="1000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Luas Kandang (m²)</label>
                    <input
                      type="number"
                      name="farm_area"
                      placeholder="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => { setShowAddFarmModal(false); setSelectedOwner(null); }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Tambah Kandang
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManajemenPengguna;
