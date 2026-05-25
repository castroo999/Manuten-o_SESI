import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState, useEffect } from "react";

export default function Header() {
  function getUser() {
    try {
      const user = localStorage.getItem("user");

      if (!user) return null;

      const parsed = JSON.parse(user);

      if (typeof parsed === "object" && parsed.user) {
        return parsed;
      }

      return null;
    } catch {
      return null;
    }
  }

  const [usuario, setUsuario] = useState(getUser());
  const [token, setToken] = useState(localStorage.getItem("token"));

  const navigate = useNavigate();

  function sair() {
    localStorage.clear();

    setUsuario(null);
    setToken(null);

    window.dispatchEvent(new Event("userChanged"));

    navigate("/");
  }

  useEffect(() => {
    function atualizarDados() {
      const user = localStorage.getItem("user");
      const tokenAtual = localStorage.getItem("token");

      setToken(tokenAtual);

      if (user) {
        setUsuario(JSON.parse(user));
      } else {
        setUsuario(null);
      }
    }

    window.addEventListener("userChanged", atualizarDados);

    return () => {
      window.removeEventListener("userChanged", atualizarDados);
    };
  }, []);

  return (
    <>
      <header className="top-header">
        
        <div className="top-bar">
          <h1>
            BEM-VINDO {usuario ? usuario.user.toUpperCase() : "VISITANTE"}
          </h1>

          <div className="perfil">
            <img src={logo} alt="perfil" />
          </div>
        </div>

        
        <nav className="menu-bar">
          <div className="menu-left">☰</div>

          <div className="menu-center">
            {!token && (
              <>
                <Link to="/">INICIO</Link>
                {/* <Link to="/">MAPA</Link> */}
                <Link to="/login">LOGIN</Link>
                <Link to="/cadastro">CADASTRAR</Link>
                <Link to="/quem-somos">QUEM SOMOS</Link>
              </>
            )}

            {token && (
              <>
                <Link to="/dashboard">INICIO</Link>
                {/* <Link to="/servicos">MAPA</Link> */}
                <Link to="/orcamentos">FAZER CHAMADO</Link>
                <Link to="/ver_orcamentos">VER CHAMADOS</Link>
                <Link to="/quem-somos">QUEM SOMOS</Link>
              </>
            )}
          </div>

          
          {usuario && (
            <div className="logout-area">
              <button onClick={sair}>SAIR</button>
            </div>
          )}
        </nav>

        
        <div className="header-bottom"></div>
      </header>
    </>
  );
}
