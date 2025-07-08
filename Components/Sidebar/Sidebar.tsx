import React from "react";
import {
  IconHomeRegular,
  IconFolderRegular,
  IconChatRegular,
  IconAppsRegular,
  IconGroupRegular,
  IconFaceHappyRegular,
} from "@telefonica/mistica";
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
                <IconHomeRegular size={24} color="currentColor" className="side-icon" />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/cursos">
                <IconFolderRegular size={24} color="currentColor" className="side-icon" />
                <span>Cursos</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/chat">
                <IconChatRegular size={24} color="currentColor" className="side-icon" />
                <span>Chat</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/plataformas">
                <IconAppsRegular size={24} color="currentColor" className="side-icon" />
                <span>Plataformas</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/time">
                <IconGroupRegular size={24} color="currentColor" className="side-icon" />
                <span>Time</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/feedback">
                <IconFaceHappyRegular size={24} color="currentColor" className="side-icon" />
                <span>Feedback</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
