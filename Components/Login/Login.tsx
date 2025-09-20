import { useState, useEffect, FormEvent, JSX } from "react";
import "./Login.css";
import { VivoLogo } from "@telefonica/mistica";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import MyPrimaryButton from "../Button/MyPrimaryButton";

const Login = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<number>(500);

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
       }
     } else {
       throw new Error("Dados de login incompletos.");
     }

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

          <MyPrimaryButton>Entrar</MyPrimaryButton>
        </form>
      </div>

      <div className="logo-container">
        <VivoLogo size={logoSize} />
      </div>
    </div>
  );
};

export default Login;
