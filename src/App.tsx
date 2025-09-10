import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "../Components/Login/Login";
import TelaInicial from "../Components/TelaInicial/TelaInicial";
import Dashboard from "../Components/Onboarding/Dashboard";
import Feedback from "../Components/Feedback/Feedback";
import Time from "../Components/Time/Time";
import Plataformas from "../Components/Plataformas/Plataformas";
import Cursos from "../Components/Cursos/Cursos";
import MainLayout from "../src/layouts/MainLayout";
import Chat from "../Components/Chat/Chat";
import Test from "../Components/Test/Test"
import ManagerPlatform from "../Components/ManagerPlatform/ManagerPlatform";
import RelatorioSemanal from "../Components/RelatorioSemanal/RelatorioSemanal";
import TelaTarefas from "../Components/TelaTarefas/TelaTarefas";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Login sem layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<TelaInicial />} />

          {/* Rotas com layout compartilhado */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/time" element={<Time />} />
            <Route path="/plataformas" element={<Plataformas />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/chat" element={<Chat userId={0} token={""} />} />
            <Route path="/test" element={<Test />} />
            <Route path="/manager" element={<ManagerPlatform />} />
            <Route path="/relatorio-semanal" element={<RelatorioSemanal />} />
            <Route path="/tarefasbase" element={<TelaTarefas />} />


          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
