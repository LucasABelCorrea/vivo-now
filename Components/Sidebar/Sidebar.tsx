import React from "react";
import { FaHome, FaBook, FaUsers, FaSmile, FaClock } from "react-icons/fa";
import { BiBot } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h2 className="logo">VIVO NOW!</h2>
        <nav>
          <ul>
            <li>
              <NavLink to="/home">
                <FaHome /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/cursos">
                <FaBook /> Cursos
              </NavLink>
            </li>
            <li>
              <NavLink to="/plataformas">
                <FaUsers /> Plataformas
              </NavLink>
            </li>
            <li>
              <NavLink to="/time">
                <FaClock /> Time
              </NavLink>
            </li>
            <li>
              <NavLink to="/feedback">
                <FaSmile /> Feedback
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
