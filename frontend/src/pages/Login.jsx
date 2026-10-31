import api from "../services/Api.js";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userFromToken } from "../services/auth.js";
import "./Cadastro.css";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();

    //pega o email e a senha para logar
    if (!email.trim() || !password) {
      toast.warning("Preencha todos os campos por favor!");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/login", {
        email: email.trim(),
        password,
      });

      //pega o token do user
      const token = response.data.token;
      const user = response.data.user || userFromToken(token);
      if (!token || !user?.user) {
        throw new Error("O servidor não retornou uma sessão válida.");
      }

      localStorage.setItem("token", token);

      //guarda o nome do user e a role dele
      localStorage.setItem("user", JSON.stringify(user));

      //dps de logar é redirecionado para a pagina inicial do site
      window.dispatchEvent(new Event("userChanged"));

      setEmail("");
      setPassword("");
      toast.success("Login feito com sucesso!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-page">
      <form className="formulario" onSubmit={login}>
        <div className="form-topo">
          <span>Acesso</span>
          <h2>Faca login para continuar</h2>
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

        <label>
          Senha
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="auth-helper">
          Nao tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
        <p className="auth-helper">
          Esqueceu sua senha? <Link to="/esqueci-senha">Clique aqui</Link>
        </p>
      </form>
    </section>
  );
}
