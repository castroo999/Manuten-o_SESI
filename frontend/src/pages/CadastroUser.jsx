
import api from "../services/Api.js";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Cadastro() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  

  async function registrar(e) {
    e.preventDefault();

    //nao deixa o usuario nao preencher todos os campos
    if (!user || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    try {

      //espera a requisição da api
      const response = await api.post("/registrar", {
        user,
        password,
      });

      navigate("/")

      //avisa se deu certo seu login
      alert(response.data.message);

      //limpa os campos
      setUser("");
      setPassword("");
      navigate("/")

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Erro ao cadastrar usuário");
    }
  }

  return (
    <div className="container">
      <div className="login">
        <h2> Bem vindo, Crie sua conta</h2>

        <form onSubmit={registrar}>
          <input
            placeholder="Usuário"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button>Cadastrar</button>
          <p className="cadastrar">
            Já tem uma conta? <Link to="/">Entrar</Link>
          </p>

        </form>
      </div>
    </div>
  );
}