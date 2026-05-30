import api from "../services/Api.js";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cadastro.css";

export default function CadastroUser() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function registrar(e) {
    e.preventDefault();

    if (!user || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await api.post("/registrar", {
        user,
        password,
      });

      alert(response.data.message);
      setUser("");
      setPassword("");
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Erro ao cadastrar usuario");
    }
  }

  return (
    <section className="form-page">
      <form className="app-form" onSubmit={registrar}>
        <div className="form-heading">
          <span>Nova conta</span>
          <h2>Crie seu acesso</h2>
        </div>

        <label>
          Usuario
          <input
            placeholder="Escolha um usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            placeholder="Crie uma senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit">Cadastrar</button>

        <p className="auth-helper">
          Ja tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </section>
  );
}
