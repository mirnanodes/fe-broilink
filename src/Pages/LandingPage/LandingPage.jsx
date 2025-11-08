import React from 'react';
import './LandingPage.css'; 
import { Link } from 'react-router-dom';

const Header = () => (
    <header className="header">
        <div className="header-content">
            <div className="logo">Broilink</div>
            <nav className="nav-links">
                <a href="#beranda">Beranda</a>
                <a href="#fitur">Fitur</a>
                <a href="#keunggulan">Keunggulan</a>
                <a href="#testimoni">Testimoni</a>
                <a href="#harga">Harga</a>
                <a href="#kontak">Kontak</a>
            </nav>
            <Link to="/login" className="btn btn-login">Login</Link>
        </div>
    </header>
);

const HeroSection = () => (
    <section id="beranda" className="hero-section">
        <div className="hero-content">
            <h1>Revolusi Peternakan Ayam dengan Teknologi Cerdas</h1>
            <p>
                Broilink, solusi terdepan untuk manajemen peternakan ayam broiler yang efisien dan modern.
            </p>
            <ul className="hero-checks">
                <li>Monitoring kesehatan ayam secara real-time dengan sensor IoT canggih</li>
                <li>Analisis data mendalam untuk optimasi pakan dan pertumbuhan</li>
                <li>Dashboard intuitif untuk manajemen kandang yang mudah</li>
            </ul>
            <button className="btn btn-main">Mulai Gabung Sekarang</button>
        </div>
        <div className="hero-image-container">
            <img 
                src="src/assets/image/kandang-ayam-broiler.jpg"
                alt="Peternakan Ayam Modern Broilink" 
                className="hero-image" 
            />
        </div>
    </section>
);

const FeatureCard = ({ title, description }) => (
    <div className="feature-card">
        <div className="feature-icon">✅</div>
        <h4>{title}</h4>
        <p>{description}</p>
    </div>
);

const FeatureSection = () => (
    <section id="fitur" className="feature-section">
        <h2 className="section-title">Fitur</h2>
        <p className="section-subtitle">Teknologi terdepan untuk mengelola ayam broiler dengan efisien dan modern.</p>
        <div className="feature-grid">
            <FeatureCard title="Monitoring Real-time" description="Pantau kandang dan kesehatan ayam secara real-time dengan sensor IoT terintegrasi." />
            <FeatureCard title="Analisis Data Cerdas" description="Optimalkan hasil dan efisiensi peternakan dengan analisis AI." />
            <FeatureCard title="Sistem Keamanan" description="Keamanan data enterprise dengan enkripsi end-to-end dan backup otomatis." />
        </div>
    </section>
);

const KeunggulanCard = ({ title, description, icon }) => (
    <div className="keunggulan-card">
        <div className="keunggulan-icon">{icon}</div>
        <h4>{title}</h4>
        <p>{description}</p>
    </div>
);

const KeunggulanSection = () => (
    <section id="keunggulan" className="keunggulan-section">
        <h2 className="section-title">Keunggulan</h2>
        <p className="section-subtitle">Mengapa ribuan peternak memilih Broilink sebagai solusi peternakan mereka.</p>
        <div className="keunggulan-grid">
            <KeunggulanCard title="Peningkatan Produktivitas" description="Tingkatkan produktivitas hingga 35% dengan monitoring otomatis" icon="📈" />
            <KeunggulanCard title="Efisiensi Waktu" description="Hemat hingga 60% waktu operasional dengan otomatisasi dan notifikasi real-time." icon="🛡️" />
            <KeunggulanCard title="Sistem Keamanan" description="Tim ahli siap mendampingi 24/7 demi suksesnya peternakan Anda." icon="💰" />
        </div>
    </section>
);

const TestimoniCard = ({ name, role, alamat, text }) => (
    <div className="testimoni-card">
        <div className="avatar">{name.charAt(0)}</div>
        <div className="testimoni-content">
            <p className="name">{name}</p>
            <p className="role">{role}</p>
            <p className="alamat">{alamat}</p>
            <p className="text">"{text}"</p>
        </div>
    </div>
);

const TestimoniSection = () => (
    <section id="testimoni" className="testimoni-section">
        <h2 className="section-title">Testimoni</h2>
        <p className="section-subtitle">Dengarkan pengalaman nyata dari peternak yang telah merasakan manfaat SmartFarm Broiler.</p>
        <div className="testimoni-grid">
            <TestimoniCard 
                name="Budi Setiawan" 
                role="Peternak" 
                alamat="Bogor, Jawa Barat"
                text="Broilink bener-bener bikin cara saya ngelola kandang jadi lebih gampang. Karena ada monitoring real-time, masalah bisa cepat ketahuan, dan hasil panen naik sampai 40%. Mantap, highly recommended!" 
            />
            <TestimoniCard 
                name="Muklis Kurniawan" 
                role="Owner"
                alamat="Surabaya, Jawa Timur"
                text="Keren banget platformnya! Supportnya cepat tanggap, dan fitur analisis data bener-bener ngebantu kami optimalkan pakan sekaligus ngurangin biaya operasional sampai 25%. Worth it banget!" 
            />
        </div>
    </section>
);

const PricingCard = ({ title, text, price, features, isFeatured }) => (
    <div className={`pricing-card ${isFeatured ? 'featured' : ''}`}>
        {isFeatured && <span className="featured-tag">⭐Paling Populer</span>}
        <h3 className="plan-title">{title}</h3>
        <p className="plan-text">{text}</p>
        <p className="plan-price">{price}</p>
        <button className="btn btn-plan">Mulai Sekarang</button>
        <ul className="plan-features">
            {features.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
    </div>
);

const PricingSection = () => (
    <section id="harga" className="pricing-section">
        <h2 className="section-title">Harga</h2>
        <div className="pricing-grid">
            <PricingCard
                title="Starter"
                text="Cocok untuk peternakan kecil"
                price="Rp299K"
                features={['Monitoring hingga 2 kandang', 'Dashboard Dasar', 'Laporan Mingguan', 'Sensor suhu & kelembapan', 'Notifikasi dasar']}
                isFeatured={false}
            />
            <PricingCard
                title="Professional"
                price="Rp588K"
                text="Cocok untuk peternakan menengah"
                features={['Monitoring unlimitid kandang', 'Dashboard advance dengan AI', 'Laporan real-time dengan custom', 'Support 24/7 (chat & phone)', 'Sensor lengkap + kamera', 'Analisis prediktif']}
                isFeatured={true}
            />
        </div>
    </section>
);

const Footer = () => (
    <footer className="main-footer">
        <div className="footer-content">
            <div className="footer-brand">
                <div className="logo">Broilink</div>
                <p>Solusi peternakan ayam broiler terdepan dengan teknologi IoT dan AI untuk hasil optimal.</p>
                <p>--------------------------------------------------------</p>
                <p>Jl. Kaliurang No. 567 Sinduadi, Sleman 55281 Yogyakarta, Indonesia</p>
                <p>© 2025 Broilink. All rights reserved.</p>
            </div>
            <div className="footer-links-group">
                <h4>Produk</h4>
                <ul>
                    <li><a href="#fitur">Fitur</a></li>
                    <li><a href="#harga">Keunggulan</a></li>
                    <li><a href="#harga">Harga</a></li>
                </ul>
            </div>
            <div className="footer-links-group">
                <h4>Perusahaan</h4>
                <ul>
                    <li><a href="#tentang">Tentang</a></li>
                    <li><a href="#karir">Karir</a></li>
                    <li><a href="#harga">Blog</a></li>
                </ul>
            </div>
            <div className="footer-links-group">
                <h4>Dukungan</h4>
                <ul>
                    <li><a href="#faq">Tentang Kami</a></li>
                    <li><a href="#kontak">Kontak</a></li>
                    <li><a href="#harga">Status</a></li>
                </ul>
            </div>
        </div>
    </footer>
);

const LandingPage = () => {
    return (
        <div className="landing-page">
            <Header />
            <main>
                <HeroSection />
                <FeatureSection />
                <KeunggulanSection />
                <TestimoniSection />
                <PricingSection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;