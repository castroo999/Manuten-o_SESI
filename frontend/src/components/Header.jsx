import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";

function getUser() {
  try {
    const user = localStorage.getItem("user");

    if (!user) return null;

    const parsed = JSON.parse(user);

    return typeof parsed === "object" && parsed.user ? parsed : null;
  } catch {
    return null;
  }
}

export default function Header() {
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
      setToken(localStorage.getItem("token"));
      setUsuario(getUser());
    }

    window.addEventListener("userChanged", atualizarDados);

    return () => {
      window.removeEventListener("userChanged", atualizarDados);
    };
  }, []);

  return (
    <header className="top-header">
      <div className="top-bar">
        <div>
          <span className="brand-kicker">Plantamatica</span>
          <h1>Bem-vindo, {usuario ? usuario.user : "visitante"}</h1>
        </div>

        <div className="perfil">
          <img src={logo} alt="Plantamatica" />
        </div>
      </div>

      <nav className="menu-bar" aria-label="Menu principal">
        <div className="menu-center">
          {!token && (
            <>
              <NavLink to="/">Inicio</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/cadastro">Cadastrar</NavLink>
              <NavLink to="/quem-somos">Quem somos</NavLink>
            </>
          )}

          {token && (
            <>
              <NavLink to="/dashboard">Mapa</NavLink>
              <NavLink to="/chamados">Abrir chamado</NavLink>
              <NavLink to="/ver_chamados">Chamados</NavLink>
              <NavLink to="/modelos">Modelos</NavLink>
              <NavLink to="/quem-somos">Quem somos</NavLink>
            </>
          )}
        </div>

        {usuario && (
          <div className="logout-area">
            <button type="button" onClick={sair}>
              Sair
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
