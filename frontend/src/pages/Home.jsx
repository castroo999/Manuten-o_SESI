import "./Home.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <>
      <div className="conteudo">

        <img src={logo} alt="logo" className="logo" />

        <h2>Bem Vindo ao PLANTAMATICA</h2>

        <div className="botao">
          <div className="coluna">

            <p>Já tem uma conta?</p>
            <Link to="/login">
              <button>Fazer login</button>
            </Link>
          </div>

          <div className="coluna">
            <p>Crie uma conta</p>
            <Link to="/cadastro">
              <button>Cadastrar</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
