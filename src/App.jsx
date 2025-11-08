import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Impor Halaman Login
import Login from "./components/Login.jsx"; // <--- JANGAN LUPA GANTI PATH INI!
// Import Halaman Admin
import DashboardAdmin from "./Pages/AdminPage/DashboardAdmin";
import ManajemenPengguna from "./Pages/AdminPage/ManajemenPengguna";
import KonfigurasiKandang from "./Pages/AdminPage/KonfigurasiKandang";
import RiwayatLaporan from "./Pages/AdminPage/RiwayatLaporan";
// Import Halaman Owner
import DashboardOwner from "./Pages/OwnerPage/DashboardOwner";
import Monitoring from "./Pages/OwnerPage/Monitoring";
import DiagramAnalisis from "./Pages/OwnerPage/DiagramAnalisis";
import ProfileOwner from "./Pages/OwnerPage/ProfileOwner";
import OwnerLayout from "./Pages/OwnerPage/OwnerLayout";
// Import Halaman Farm
import DashboardFarm from "./Pages/FarmPage/DashboardFarm";
import InputKerjaFarm from "./Pages/FarmPage/InputKerjaFarm";
import ProfilFarm from "./Pages/FarmPage/ProfileFarm";

// Komponen Pembungkus untuk Proteksi Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Cek boolean
  const userRole = localStorage.getItem('userRole');

  if (!isLoggedIn) {
    // Jika belum login, selalu redirect ke /login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Jika login, tetapi role tidak sesuai, redirect ke default dashboard atau halaman error
    return <Navigate to="/" replace />; // atau ke halaman 403 Access Denied
  }

  return children;
};

function App() {
  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <Routes>
        {/* 1. Route Login (Tidak Terproteksi) */}
        <Route path="/login" element={<Login />} />

        {/* 2. Route Halaman Admin (Terproteksi & Role Specific) */}
        <Route
          path="/dashboard-admin"
          element={<ProtectedRoute allowedRoles={['Admin']}><DashboardAdmin /></ProtectedRoute>}
        />
        <Route
          path="/manajemen-pengguna"
          element={<ProtectedRoute allowedRoles={['Admin']}><ManajemenPengguna /></ProtectedRoute>}
        />
        <Route
          path="/konfigurasi-kandang"
          element={<ProtectedRoute allowedRoles={['Admin']}><KonfigurasiKandang /></ProtectedRoute>}
        />
        <Route
          path="/riwayat-laporan"
          element={<ProtectedRoute allowedRoles={['Admin']}><RiwayatLaporan /></ProtectedRoute>}
        />

        {/* 3. Route Halaman Owner (Terproteksi & Role Specific) */}
        <Route
          path="/"
          element={<ProtectedRoute allowedRoles={['Owner']}><OwnerLayout /></ProtectedRoute>}
        >
          <Route path="dashboard-owner" element={<DashboardOwner />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="diagram-analisis" element={<DiagramAnalisis />} />
          <Route path="profile-owner" element={<ProfileOwner />} />
        </Route>
        
        {/* 4. Route Halaman Peternak (Terproteksi & Role Specific) */}
        <Route
          path="/dashboard-peternak"
          element={<ProtectedRoute allowedRoles={['Peternak']}><DashboardFarm /></ProtectedRoute>}
        />
        <Route
          path="/input-kerja-farm"
          element={<ProtectedRoute allowedRoles={['Peternak']}><InputKerjaFarm /></ProtectedRoute>}
        />
        <Route
          path="/profile-farm"
          element={<ProtectedRoute allowedRoles={['Peternak']}><ProfilFarm /></ProtectedRoute>}
        />

        {/* 5. Route Root (Redirect Cerdas) */}
        <Route path="/" element={
          localStorage.getItem('isLoggedIn') === 'true' 
            ? <Navigate to={
                userRole === 'Admin' ? '/dashboard-admin' :
                userRole === 'Owner' ? '/dashboard-owner' :
                userRole === 'Peternak' ? '/dashboard-peternak' :
                '/login' // Fallback jika role tidak terdefinisi
              } replace />
            : <Navigate to="/login" replace /> // Jika belum login, selalu arahkan ke login
        } />

        {/* 6. Route Catch-all (404 Not Found) */}
        <Route path="*" element={<div>404 Not Found</div>} />
        
      </Routes>
    </Router>
  );
}

export default App;