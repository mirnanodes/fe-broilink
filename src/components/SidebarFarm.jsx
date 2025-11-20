import { Home, Monitor, BarChart3 } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function SidebarFarm() {
  const menus = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard-farm" },
    { name: "Input Hasil Kerja", icon: <Paper size={18} />, path: "/input-kerja-farm" },
    { name: "Profil", icon: <People size={18} />, path: "/profile-farm" },
  ];

  return (
    <div className="w-56 bg-gray-100 h-screen fixed left-0 top-0 border-r">
      <div className="p-6 text-xl font-semibold">Broilink</div>
      <nav className="flex flex-col mt-4 space-y-2">
        {menus.map((menu, i) => (
          <NavLink
            key={i}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2 rounded-r-full transition-all ${
                isActive
                  ? "bg-green-100 text-green-600 font-medium"
                  : "text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            {menu.icon}
            {menu.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
