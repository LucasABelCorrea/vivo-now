import { useState, ChangeEvent, FormEvent, JSX } from "react";
import "./Login.css";
import { Logo } from "@telefonica/mistica";
import Button from "../Button/Button";
import { login } from "../../src/services/auth";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = (): JSX.Element => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // limpa o erro anterior

    try {
      const resultado = await login(username, password);
      console.log("Login realizado com sucesso:", resultado);

      // Redireciona após login
      navigate("/home");

      // Limpa os campos
      setUsername("");
      setPassword("");
    } catch (erro: any) {
      console.error("Erro ao fazer login:", erro);
      setError(erro.message || "Erro inesperado ao fazer login.");
    }
  };

  return (
    <div className="container">
      <div className="form">
        <form onSubmit={handleSubmit}>
          <h1>BEM VINDO(A)</h1>
          <h4>Preencha seus dados</h4>

          <div className="input-field">
            <h3>Email</h3>
            <input
              type="email"
              placeholder="Seu email"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          {/* Mensagem de erro visível */}
          {error && <p className="error-message">{error}</p>}

          <div className="recall-forget"></div>

          <Button type="submit">Entrar</Button>
        </form>
      </div>

      <div className="logo">
        <img src="/images/logo-vivo.png" alt="Logo Vivo" />
      </div>
    </div>
  );
};

export default Login;
