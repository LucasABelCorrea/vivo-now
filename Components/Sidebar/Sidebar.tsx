import React from "react";
import { GrHomeRounded } from "react-icons/gr";
import { TbFolder } from "react-icons/tb";
import { CiGrid41 } from "react-icons/ci";
import { IoPeopleOutline } from "react-icons/io5";
import { VscFeedback } from "react-icons/vsc";
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
                <GrHomeRounded className="side-icon"/> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/cursos">
                <TbFolder className="side-icon"/> Cursos
              </NavLink>
            </li>
            <li>
              <NavLink to="/plataformas">
                <CiGrid41 className="side-icon"/> Plataformas
              </NavLink>
            </li>
            <li>
              <NavLink to="/time">
                <IoPeopleOutline className="side-icon"/> Time
              </NavLink>
            </li>
            <li>
              <NavLink to="/feedback">
                <VscFeedback className="side-icon"/> Feedback
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
