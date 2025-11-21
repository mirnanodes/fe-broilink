import React, { useState, useRef } from 'react';

export default function ProfilePeternak() {
  const [profileData, setProfileData] = useState({
    name: 'Budi',
    phone: '081234567890',
    email: 'budi@example.com',
    profileImage: null
  });

  const [originalPhone, setOriginalPhone] = useState('081234567890');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingChanges, setPendingChanges] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhoneChange = (value) => {
    setProfileData({ ...profileData, phone: value });
  };

  const handleEmailChange = (value) => {
    setProfileData({ ...profileData, email: value });
  };

  const sendOtp = async () => {
    try {
      // TODO: Replace with actual API call to send OTP
      console.log('Sending OTP to:', originalPhone);
      alert(`Kode OTP telah dikirim ke ${originalPhone}`);
      return true;
    } catch (error) {
      alert('Gagal mengirim OTP!');
      return false;
    }
  };

  const verifyOtp = async (code) => {
    try {
      // TODO: Replace with actual API call to verify OTP
      console.log('Verifying OTP:', code);
      // Simulate OTP verification (for demo, accept "123456")
      if (code === '123456') {
        return true;
      }
      alert('Kode OTP salah!');
      return false;
    } catch (error) {
      alert('Gagal verifikasi OTP!');
      return false;
    }
  };

  const handleSave = async () => {
    const phoneChanged = profileData.phone !== originalPhone;

    if (phoneChanged) {
      // Store pending changes and request OTP
      setPendingChanges({ ...profileData });
      const otpSent = await sendOtp();
      if (otpSent) {
        setShowOtpModal(true);
      }
    } else {
      // No phone change, save directly
      await saveProfile(profileData);
    }
  };

  const handleOtpSubmit = async () => {
    const verified = await verifyOtp(otpCode);
    if (verified) {
      setShowOtpModal(false);
      await saveProfile(pendingChanges);
      setOriginalPhone(pendingChanges.phone);
      setOtpCode('');
      setPendingChanges(null);
    }
  };

  const saveProfile = async (data) => {
    try {
      // TODO: Replace with actual API call
      console.log('Saving profile:', data);
      alert('Profil berhasil diperbarui!');
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userPhone', data.phone);
      localStorage.setItem('userEmail', data.email);
    } catch (error) {
      alert('Gagal menyimpan profil!');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profil Peternak</h1>

      <div className="bg-white p-8 rounded-lg shadow border border-gray-200 max-w-2xl">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 flex items-center justify-center overflow-hidden">
            {profileData.profileImage ? (
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Ubah Foto Profil
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          {/* Name - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <input
                type="text"
                value={profileData.name}
                disabled
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan nomor WhatsApp"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan email"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Verifikasi OTP</h3>
            <p className="text-sm text-gray-600 mb-4">
              Kode OTP telah dikirim ke nomor WhatsApp lama Anda ({originalPhone}). Masukkan kode 6 digit untuk melanjutkan.
            </p>
            <input
              type="text"
              maxLength="6"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest mb-6"
              placeholder="000000"
            />
            <div className="flex gap-3">
              <button
                onClick={handleOtpSubmit}
                disabled={otpCode.length !== 6}
                className="flex-1 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verifikasi
              </button>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtpCode('');
                  setPendingChanges(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
