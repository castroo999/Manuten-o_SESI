import api from "../services/Api.js";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp } from "lucide-react";
import { toast } from "react-toastify";
import "./Cadastro.css";
import "./Login.css";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  async function login(e) {
    e.preventDefault();

    //pega o user e a senha para logar
    if (!user || !password) {
      toast.warning("Preencha todos os campos por favor!");
      return;
    }else{
      toast.success("Login feito com sucesso");
    }

    try {
      const response = await api.post("/login", {
        user,
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
          role: decoded.role,
        }),
      );

      //dps de logar é redirecionado para a pagina inicial do site
      window.dispatchEvent(new Event("userChanged"));

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
      <form className="formulario" onSubmit={login}>
        <div className="form-topo">
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

    </section>
  );
}
