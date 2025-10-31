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
import ManagerPlatform from "../Components/ManagerPlatform/ManagerPlatform";
import RelatorioSemanal from "../Components/RelatorioSemanal/RelatorioSemanal";
import TelaTarefas from "../Components/TelaTarefas/TelaTarefas";
import HomeGestor from "../Components/HomeGestor/HomeGestor";
import HomeBuddy from "../Components/HomeBuddy/HomeBuddy";
import TelaVisualizacaoOnboarding from "../Components/TelaTarefas/TelaVisualizacaoOnboarding";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Telas sem layout */}
          <Route path="/" element={<TelaInicial />} />
          <Route path="/login" element={<Login />} />

          {/* Telas com layout compartilhado */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/time" element={<Time />} />
            <Route path="/plataformas" element={<Plataformas />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/plataformasgestor" element={<ManagerPlatform />} />
            <Route path="/relatorio" element={<RelatorioSemanal />} />
            <Route path="/edicaoOnboarding/:id" element={<TelaTarefas />} />
            <Route path="/homegestor" element={<HomeGestor />} />
            <Route path="/homebuddy" element={<HomeBuddy />} />
            <Route
              path="/visualizacaoOnboarding/:id"
              element={<TelaVisualizacaoOnboarding />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
