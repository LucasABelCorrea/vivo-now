import { BrowserRouter, Routes, Route } from "react-router-dom";
import { JSX } from "react";
import "./App.css";
import Login from "../Components/Login/Login";
import Home from "../Components/TelaInicial/TelaInicial";
import MainLayout from "./layouts/MainLayout";
import Feedback from "../Components/Feedback/Feedback";
import Time from "../Components/Time/Time";

function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Login sem layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />

          {/* Rotas com layout compartilhado */}
          <Route element={<MainLayout children={undefined} />}>
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/time" element={<Time />}/>
            {/* outras rotas aqui */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
