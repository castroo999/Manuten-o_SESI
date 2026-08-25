import api from "../services/Api.js";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Cadastro.css";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e) {
    e.preventDefault();

    //pega o email e a senha para logar
    if (!email || !password) {
      toast.warning("Preencha todos os campos por favor!");
      return;
    } else {
      toast.success("Login feito com sucesso carregando...");
    }

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      //pega o token do user
      const token = response.data.token;
      localStorage.setItem("token", token);

      //corta a array do token para pegar somente o nome
      const decoded = JSON.parse(atob(token.split(".")[1]));

      //guarda o nome do user e a role dele
      localStorage.setItem(
        "user",
        JSON.stringify({
          user: decoded.user,
          email: decoded.email,
          role: decoded.role,
        }),
      );

      //dps de logar é redirecionado para a pagina inicial do site
      window.dispatchEvent(new Event("userChanged"));

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Erro ao fazer login");
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

        <button type="submit">Entrar</button>

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
