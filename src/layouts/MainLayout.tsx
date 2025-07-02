import React from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "./MainLayout.css";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
