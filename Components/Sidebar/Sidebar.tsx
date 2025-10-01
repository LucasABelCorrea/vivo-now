import React from "react";
import {
  IconHomeRegular,
  IconFolderRegular,
  IconChatRegular,
  IconAppsRegular,
  IconGroupRegular,
  IconFaceHappyRegular,
  IconExitDoorRegular,
} from "@telefonica/mistica";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "";

  // Define rotas por role
  let homeRoute = "/home";
  switch (role.toUpperCase()) {
    case "MANAGER":
      homeRoute = "/homegestor";
      break;
    case "BUDDY":
      homeRoute = "/homebuddy";
      break;
    case "COLLABORATOR":
      homeRoute = "/home";
      break;
  }

  let plataformaRoute = "/plataformas";
  if (role.toUpperCase() === "MANAGER") {
    plataformaRoute = "/plataformasgestor";
  }

  const cursoEdicao = "/cursos";

  // Função de logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h2 className="logo">VIVO NOW!</h2>

        <nav>
          <ul>
            <li>
              <NavLink to={homeRoute}>
                <IconHomeRegular
                  size={24}
                  color="currentColor"
                  className="side-icon"
                />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={cursoEdicao}>
                <IconFolderRegular
                  size={24}
                  color="currentColor"
                  className="side-icon"
                />
                <span>Cursos</span>
              </NavLink>
            </li>
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
            <li>
              <NavLink to={plataformaRoute}>
                <IconAppsRegular
                  size={24}
                  color="currentColor"
                  className="side-icon"
                />
                <span>Plataformas</span>
              </NavLink>
            </li>
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
            <li>
              <button className="logout-button" onClick={handleLogout}>
                <IconExitDoorRegular
                  size={24}
                  color="currentColor"
                  className="side-icon"
                />
                <span>Sair</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;