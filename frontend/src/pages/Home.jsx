import "./Home.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="home-page">
      <div className="home-content">
        <div className="home-copy">
          <span className="home-label">Manutencao escolar</span>
          <h2>Bem-vindo ao Plantamatica</h2>
          <p>
            Registre chamados, acompanhe manutencoes e ajude a organizar os
            cuidados com os espacos da escola.
          </p>

          <div className="home-actions">
            <Link className="primary-action" to="/login">
              Fazer login
            </Link>

            <Link className="secondary-action" to="/cadastro">
              Criar conta
            </Link>
          </div>
        </div>

        <div className="home-logo-card">
          <img src={logo} alt="Logo Plantamatica" />
        </div>
      </div>
    </section>
  );
}
