import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// nb mirna: tambahin import axios
import axios from 'axios'; 
import './Login.css'

const BroilinkLogo = () => (
    <div className="broilink-logo-container">
        <span className="broilink-logo-text">Broilink</span>
    </div>
);

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // nb mirna: state untuk show/hide password dan remember me (diinisialisasi sebagai boolean)
    const [showPassword, setShowPassword] = useState(false); 
    const [rememberMe, setRememberMe] = useState(false); 

    // nb mirna: fungsi handleSubmit untuk login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset pesan error
        
        // nb mirna: Trim whitespace dari input username dan password
        const trimmedEmail = username.trim();
        const trimmedPassword = password.trim();

        try {
            // nb mirna: Panggil API login dengan data yang sudah di-trim
            const response = await axios.post('/api/login', { 
                email: trimmedEmail, 
                password: trimmedPassword,
            });

            // nb mirna: Ambil data user dan token dari response
            const { user, token } = response.data.data;
            
            // Simpan data login di Local Storage
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', user.role); 

            // REDIRECT BERDASARKAN ROLE
            if (user.role === 'Admin') {
                navigate('/dashboard-admin');
            } else if (user.role === 'Owner') {
                navigate('/dashboard-owner');
            } else if (user.role === 'Peternak') {
                navigate('/dashboard-peternak');
            } else {
                setError('Role pengguna tidak dikenal.');
                localStorage.clear();
            }

        } catch (err) {
            // Tangani error dari Backend (401 Unauthorized, 404 Not Found, dll.)
            console.error("Login Error Response:", err.response);
            
            if (err.response && err.response.status === 401) {
                // Kredensial tidak valid (Unauthorized)
                setError('Username atau Password salah');
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Terjadi kesalahan koneksi atau server.');
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
                        {/* Tampilkan pesan error jika ada */}
                        {error && <p className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</p>}
                        
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder=" "
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <span 
                                className="toggle-password" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {/* KODE ASLI DIPERTAHANKAN SESUAI PERMINTAAN ANDA */}
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