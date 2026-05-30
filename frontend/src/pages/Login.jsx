import api from "../services/Api.js";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp } from "lucide-react";
import "./Cadastro.css";
import "./Login.css";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [userModal, setUserModal] = useState("");

  async function login(e) {
    e.preventDefault();

    if (!user || !password) {
      alert("Preencha todos os campos por favor!");
      return;
    }

    try {
      const response = await api.post("/login", {
        user,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      const decoded = JSON.parse(atob(token.split(".")[1]));

      localStorage.setItem(
        "user",
        JSON.stringify({
          user: decoded.user,
          role: decoded.role,
        }),
      );

      window.dispatchEvent(new Event("userChanged"));
      setUserModal(decoded.user);
      setModalAberto(true);

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);

      setUser("");
      setPassword("");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Erro ao fazer login");
    }
  }

  return (
    <section className="form-page">
      <form className="app-form" onSubmit={login}>
        <div className="form-heading">
          <span>Acesso</span>
          <h2>Faca login para continuar</h2>
        </div>

        <label>
          Usuario
          <input
            placeholder="Digite seu usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit">Entrar</button>

        <p className="auth-helper">
          Nao tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>

      {modalAberto && (
        <div className="overlay4">
          <div className="modal3">
            <div className="sucesso">
              <h3>
                <ThumbsUp color="green" size={30} />
                Login realizado com sucesso! Bem-vindo, {userModal}!
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
