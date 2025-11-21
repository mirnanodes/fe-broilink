import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { getCsrfCookie } from '../utils/axios';

const BroilinkLogo = () => (
  <div className="broilink-logo-container">
    <span className="broilink-logo-text">Broilink</span>
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

      const response = await axiosInstance.post('/api/login', {
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
    <div className="login-container">
      <div className="login-box">
        <div className="login-form-side">
          <h1 className="welcome-title">Selamat Datang</h1>
          <p className="subtitle">Masuk ke akun Broilink Anda</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️'}
              </span>
            </div>

            <div className="remember-me-checkbox">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Ingat Saya</label>
            </div>

            <button type="submit" className="login-button">
              Masuk
            </button>
          </form>

          <div className="form-links">
            <a href="#lupa-password" className="link-forgot">Lupa Password?</a>
            <a href="#masalah-akun" className="link-issue">Ada Masalah Akun?</a>
          </div>
        </div>

        <div className="product-info-side">
          <BroilinkLogo />
          <p className="tagline">
            Teknologi pintar untuk peternakan ayam broiler yang lebih efisien dan produktif
          </p>
          <ul className="feature-list">
            <li><span className="dot dot-green"></span> Monitoring Real-time</li>
            <li><span className="dot dot-blue"></span> Analisis Data Cerdas</li>
            <li><span className="dot dot-green"></span> Otomasi Kandang</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
