import { BrowserRouter, Routes, Route } from "react-router-dom";
import { JSX } from "react";
import "./App.css";
import Login from "../Components/Login/Login";
import MainLayout from "./layouts/MainLayout";
import Feedback from "../Components/Feedback/Feedback";
import Time from "../Components/Time/Time";
import Plataformas from "../Components/Plataformas/Plataformas";
import Cursos from "../Components/Cursos/Cursos";
import Chat from "../Components/Chat/Chat";
import TelaInicial from "../Components/TelaInicial/TelaInicial";
import Dashboard from "../Components/Onboarding/Dashboard";

function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Login sem layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<TelaInicial />} />

          {/* Rotas com layout compartilhado */}
          <Route element={<MainLayout children={undefined} />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/time" element={<Time />}/>
            <Route path="/plataformas" element={<Plataformas />}/>
            <Route path="/cursos" element={<Cursos />}/>
            <Route path="/chat" element={<Chat />}/>
            {/* outras rotas aqui */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
