import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { getCsrfCookie } from '../utils/axios';

const BroilinkLogo = () => (
  <div className="flex items-center text-2xl font-bold mb-5">
    <span className="text-xl">Broilink</span>
  </div>
);

const Login = ({ setIsLoggedIn, setUserRole }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername) {
      setError('Username harus diisi');
      return;
    }
    if (!trimmedPassword) {
      setError('Password harus diisi');
      return;
    }

    try {
      // CRITICAL: Get CSRF cookie BEFORE login
      await getCsrfCookie();

      const response = await axiosInstance.post('/login', {
        username: trimmedUsername,
        password: trimmedPassword,
      });

      const { user, token } = response.data.data;

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);

      if (setIsLoggedIn) setIsLoggedIn(true);
      if (setUserRole) setUserRole(user.role);

      if (user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'Owner') {
        navigate('/owner/dashboard');
      } else if (user.role === 'Peternak') {
        navigate('/peternak');
      } else {
        setError('Role pengguna tidak dikenal');
        localStorage.clear();
      }
    } catch (err) {
      console.error('Login Error:', err.response);

      if (err.response && err.response.status === 401) {
        setError('Username atau Password salah');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Terjadi kesalahan koneksi atau server');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex w-[900px] shadow-lg rounded-lg overflow-hidden">
        {/* Left Side - Login Form */}
        <div className="flex-1 px-12 py-16 bg-white">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Selamat Datang</h1>
          <p className="text-base text-gray-600 mb-10">Masuk ke akun Broilink Anda</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <div>
              <label htmlFor="username" className="block mb-1 text-sm font-semibold text-gray-800">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full px-3 py-3 border border-gray-300 rounded text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-800">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-3 py-3 pr-10 border border-gray-300 rounded text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️'}
                </span>
              </div>
            </div>

            <div className="flex items-center my-4">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600 cursor-pointer">
                Ingat Saya
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 text-white rounded text-base font-bold hover:bg-blue-700 transition-colors"
            >
              Masuk
            </button>
          </form>

          <div className="text-center mt-6 space-x-5">
            <a href="#lupa-password" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              Lupa Password?
            </a>
            <a href="#masalah-akun" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              Ada Masalah Akun?
            </a>
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="flex-1 px-10 py-16 bg-gray-100 flex flex-col justify-center">
          <BroilinkLogo />
          <p className="text-sm leading-relaxed text-gray-600 mb-10">
            Teknologi pintar untuk peternakan ayam broiler yang lebih efisien dan produktif
          </p>
          <ul className="space-y-4">
            <li className="flex items-center text-base text-gray-800">
              <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full mr-2.5 blur-[1.5px]"></span>
              Monitoring Real-time
            </li>
            <li className="flex items-center text-base text-gray-800">
              <span className="inline-block w-2.5 h-2.5 bg-blue-600 rounded-full mr-2.5 blur-[1.5px]"></span>
              Analisis Data Cerdas
            </li>
            <li className="flex items-center text-base text-gray-800">
              <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full mr-2.5 blur-[1.5px]"></span>
              Otomasi Kandang
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
