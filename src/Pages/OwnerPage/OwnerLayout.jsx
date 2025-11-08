import React from "react";
import NavbarOwner from '../../components/NavbarOwner';
import SidebarOwner from "../../components/SidebarOwner";
import { Outlet } from "react-router-dom";
import DashboardOwner from "./DashboardOwner";
import Monitoring from "./Monitoring";
import DiagramAnalisis from "./DiagramAnalisis";
import ProfileOwner from "./ProfileOwner";

export default function OwnerLayout() {
  return (
    <div className="flex">
      <SidebarOwner />

      <div className="ml-56 flex-1 flex flex-col min-h-screen bg-gray-50">
        <NavbarOwner />

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
