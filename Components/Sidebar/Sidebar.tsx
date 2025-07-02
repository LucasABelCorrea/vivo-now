import React from "react";
import { GrHomeRounded } from "react-icons/gr";
import { TbFolder } from "react-icons/tb";
import { CiGrid41 } from "react-icons/ci";
import { IoPeopleOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { VscFeedback } from "react-icons/vsc";
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
                <GrHomeRounded className="side-icon" />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/cursos">
                <TbFolder className="side-icon" />
                <span>Cursos</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/chat">
                <IoChatbubbleEllipsesOutline className="side-icon" />
                <span>Chat</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/plataformas">
                <CiGrid41 className="side-icon" />
                <span>Plataformas</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/time">
                <IoPeopleOutline className="side-icon" />
                <span>Time</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/feedback">
                <VscFeedback className="side-icon" />
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
