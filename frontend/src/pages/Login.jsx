import api from "../services/Api.js";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ThumbsUp } from "lucide-react";
import "./Cadastro.css";
import "./Login.css";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [userModal, setUserModal] = useState("");
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();

    //evita q o usuario deixe um campo sem preencher
    if (!user || !password) {
      alert("Preencha todos os campos por favor!");
      return;
    }

    try {
      //pega os dados da api
      const response = await api.post("/login", {
        user,
        password,
      });

      // pega o token
      const token = response.data.token;

      // salva o token
      localStorage.setItem("token", token);

      // decodifica o token
      const decoded = JSON.parse(atob(token.split(".")[1]));

      // salva token e user
      localStorage.setItem(
        "user",
        JSON.stringify({
          user: decoded.user,
          role: decoded.role,
        }),
      );
      //para salvar a mudança de conta automaticamente
      window.dispatchEvent(new Event("userChanged"));

      //para pegar somente o nome do usuario
      setUserModal(decoded.user);
      //para abrir o modal de login
      setModalAberto(true);

      // espera um pouco e depois redireciona pra home
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

      // limpa tudo dps
      setUser("");
      setPassword("");
    } catch (error) {
      console.log("USER DIGITADO:", user);
      console.error(error.response?.data || error.message);
      alert("Erro ao fazer login");
    }
  }

  return (
    <div className="container">
      <div className="login">
        <h2>Bem vindo, faça login para continuar!</h2>

        <form onSubmit={login}>
          <input
            placeholder="Login"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Entrar</button>

          <p className="cadastrar">
            Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </div>

      {modalAberto && (
        <div className="overlay4">
          <div className="modal3">
            <div className="sucesso">
              <h3>
                <ThumbsUp
                  color="green"
                  size={30}
                  style={{ marginRight: "8px" }}
                />
                Login realizado com sucesso! Bem Vindo, {userModal}!
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
