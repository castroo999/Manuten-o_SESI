import api from "../services/Api.js";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./Cadastro.css";

export default function CadastroUser() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function registrar(e) {
    e.preventDefault();

    //nao deixa ficar campo sem ser preenchido
    if (!user || !email || !password) {
      toast.warning("Preencha todos os campos!");
      return;
    }

    try {
      await api.post("/registrar", {
        user,
        email,
        password,
      });

      setUser("");
      setEmail("");
      setPassword("");
      navigate("/login");

      toast.success("Usuario cadastrado com sucesso");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.warning("Erro ao cadastrar usuario");
    }
  }

  return (
    <section className="form-page">
      <form className="formulario" onSubmit={registrar}>
        <div className="form-topo">
          <span>Nova conta</span>
          <h2>Crie sua conta</h2>
        </div>

        <label>
          Usuario
          <input
            placeholder="Cadastre um usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            placeholder="Cadastre seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
