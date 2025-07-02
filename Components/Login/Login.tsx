import { useState, FormEvent, JSX } from "react";
import "./Login.css";
import { Logo, ButtonPrimary } from "@telefonica/mistica";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Login = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || "Credenciais inválidas");
      }

      const resultado = await response.json();
      console.log("Login bem-sucedido:", resultado);

      if (resultado.token) {
        localStorage.setItem("token", resultado.token);
      }

      navigate("/home");
      setEmail("");
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
          <div className="titulo">
            <h1>BEM VINDO(A)</h1>
            <h4>Preencha seus dados</h4>
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

          {error && <p className="error-message">{error}</p>}
          <div className="recall-forget" />

         
       <ButtonPrimary
  onPress={() => {
    document
      .querySelector("form")
      ?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
  }}
  style={{ width: "100%", marginTop: 16 }}
>
  Entrar
</ButtonPrimary>
        </form>
      </div>

      <div className="logo">
        <img src="/images/logo-vivo.png" alt="Logo Vivo" />
      </div>
    </div>
  );
};

export default Login;
