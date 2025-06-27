import React from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "./MainLayout.css";
import { Outlet } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <Sidebar />
      </aside>
      <main className="main-content"><Outlet /></main>
    </div>
  );
};

export default MainLayout;
