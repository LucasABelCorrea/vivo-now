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
  const role = localStorage.getItem("role");

  const isManager = role === "MANAGER";
  const isCollaborator = role === "COLLABORATOR";
  const isBuddy = role === "BUDDY";

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h2 className="logo">VIVO NOW!</h2>

        <nav>
          <ul>
            {/* Home */}
            <li>
              <NavLink to={isManager ? "/home-manager" : "/home"}>
                <IconHomeRegular
                  size={24}
                  color="currentColor"
                  className="side-icon"
                />
                <span>Home</span>
              </NavLink>
            </li>

            {/* Cursos */}
            {isCollaborator && (
              <li>
                <NavLink to="/cursos">
                  <IconFolderRegular
                    size={24}
                    color="currentColor"
                    className="side-icon"
                  />
                  <span>Cursos</span>
                </NavLink>
              </li>
            )}

            {/* Chat */}
            <li>
              <NavLink to="/chat">
                <IconChatRegular
                  size={24}
                  color="currentColor"
                  className="side-icon"
                />
                <span>Chat</span>
              </NavLink>
            </li>

            {/* Plataformas */}

            <li>
              <NavLink
                to={isCollaborator ? "/plataformas" : "/manager-plataformas"}
              >
                <IconAppsRegular
                  size={24}
                  color="currentColor"
                  className="side-icon"
                />
                <span>Plataformas</span>
              </NavLink>
            </li>

            {/* Time */}
            <li>
              <NavLink to="/time">
                <IconGroupRegular
                  size={24}
                  color="currentColor"
                  className="side-icon"
                />
                <span>Time</span>
              </NavLink>
            </li>

            {/* Feedback */}
            <li>
              <NavLink to="/feedback">
                <IconFaceHappyRegular
                  size={24}
                  color="currentColor"
                  className="side-icon"
                />
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
