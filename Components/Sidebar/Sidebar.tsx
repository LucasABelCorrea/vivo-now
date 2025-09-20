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
  const role = localStorage.getItem("role") || "";

  // Define a rota de acordo com o role
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
  switch (role.toUpperCase()) {
    case "MANAGER":
     plataformaRoute = "/plataformasgestor";
      break;
    case "BUDDY":
      plataformaRoute = "/plataformas";
      break;
    case "COLLABORATOR":
      plataformaRoute = "/plataformas";
      break;
  }

    let cursoEdicao = "/cursos";
  switch (role.toUpperCase()) {
    case "MANAGER":
     cursoEdicao = "/cursos";
      break;
    case "BUDDY":
      cursoEdicao = "/cursos";
      break;
    case "COLLABORATOR":
      cursoEdicao = "/cursos";
      break;
  }

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h2 className="logo">VIVO NOW!</h2>


        <nav>
          <ul>
             <li>
              <NavLink to={homeRoute}>
                <IconHomeRegular size={24} color="currentColor" className="side-icon" />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={cursoEdicao}>
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
              <NavLink to={plataformaRoute}>
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