import api from "../services/Api.js";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./Cadastro.css";
import "./Login.css";

export default function EsqueceuSenha() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");

  async function solicitarRecuperacao(e) {
    e.preventDefault();

    if (!email) {
      toast.warning("Informe seu email");
      return;
    }

    try {
      const response = await api.post("/auth/esqueci-senha", { email });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao solicitar recuperacao");
    }
  }

  async function redefinirSenha(e) {
    e.preventDefault();

    if (!token || !password) {
      toast.warning("Informe o token e a nova senha");
      return;
    }

    try {
      const response = await api.post("/auth/redefinir-senha", {
        token,
        password,
      });

      toast.success(response.data.message);
      setToken("");
      setPassword("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao redefinir senha");
    }
  }

  return (
    <section className="form-page">
      <form className="formulario" onSubmit={solicitarRecuperacao}>
        <div className="form-topo">
          <span>Recuperacao</span>
          <h2>Recupere sua senha</h2>
        </div>

        <label>
          Email
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <button type="submit">Enviar recuperacao</button>

        <p className="auth-helper">
          Ja tem acesso? <Link to="/login">Voltar para login</Link>
        </p>
      </form>

      <form className="formulario" onSubmit={redefinirSenha}>
        <div className="form-topo">
          <span>Nova senha</span>
          <h2>Informe o token recebido</h2>
        </div>

        <label>
          Token
          <input
            placeholder="Cole o token de recuperacao"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </label>

        <label>
          Nova senha
          <input
            type="password"
            placeholder="Digite sua nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit">Redefinir senha</button>
      </form>
    </section>
  );
}
