import { useState, useEffect, FormEvent, JSX } from "react";
import "./Login.css";
import { VivoLogo } from "@telefonica/mistica";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import MyPrimaryButton from "../Button/MyPrimaryButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [logoSize, setLogoSize] = useState<number>(500);
  const API_BASE = (import.meta as any).env?.VITE_API_BASE;
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 480) {
        setLogoSize(160);
      } else if (width < 768) {
        setLogoSize(200);
      } else if (width < 1224) {
        setLogoSize(300);
      } else {
        setLogoSize(500);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();

      if (!response.ok) {
        let errorMessage = "Credenciais inválidas";
        try {
          const errorBody = JSON.parse(text);
          errorMessage = errorBody.message || errorMessage;
        } catch {
          // corpo vazio ou não JSON
        }
        toast.error(errorMessage);
        return;
      }

      let resultado: any = {};
      try {
        resultado = JSON.parse(text);
      } catch {
        toast.error("Resposta inválida da API.");
        return;
      }

      const { token, userId, role } = resultado;

      if (token && userId && role) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId.toString());
        localStorage.setItem("role", role);

        const nomeExtraido = email.split("@")[0].trim();
        localStorage.setItem("userName", nomeExtraido);

        switch (role.toUpperCase()) {
          case "COLLABORATOR":
            navigate("/home");
            break;
          case "MANAGER":
            navigate("/homegestor");
            break;
          case "BUDDY":
            navigate("/homebuddy");
            break;
          default:
            toast.error("Tipo de usuário desconhecido.");
            return;
        }

        setEmail("");
        setPassword("");
      } else {
        toast.error("Dados de login incompletos.");
      }
    } catch (erro: any) {
      console.error("Erro ao fazer login:", erro);
      toast.error(erro.message || "Erro inesperado ao fazer login.");
    }
  };

  return (
    <div className="container">
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="titulo">
            <h1>BEM VINDO(A)</h1>
            <h4 id="sub-titulo">Preencha seus dados</h4>
          </div>

          <div className="input-field">
            <h3>Email</h3>
            <input
              type="email"
              placeholder="Seu email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-field senha-wrapper">
            <h3>Senha</h3>
            <div className="input-with-icon">
              <input
                type={senhaVisivel ? "text" : "password"}
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-icon"
                onClick={() => setSenhaVisivel(!senhaVisivel)}
              >
                {senhaVisivel ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <MyPrimaryButton>Entrar</MyPrimaryButton>
        </form>
      </div>

      <div className="logo-container">
        <VivoLogo size={logoSize} />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
