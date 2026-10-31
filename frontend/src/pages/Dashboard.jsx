import "./Dashboard.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import api from "../services/Api";
import { readStoredUser } from "../services/auth.js";

export default function Dash() {
  const [stats, setStats] = useState({
    usuarios: 0,
    chamados: 0,
    abertos: 0,
    andamento: 0,
    resolvidos: 0,
  });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  const usuarioLogado = readStoredUser();

  const COLORS = ["#f2a900", "#2563eb", "#22c55e"];

  const dadosGrafico = [
    {
      name: "Abertos", // nome exibido na legenda
      value: stats.abertos, // quantidade de chamados abertos
    },
    {
      name: "Em andamento",
      value: stats.andamento,
    },
    {
      name: "Resolvidos",
      value: stats.resolvidos,
    },
  ];

  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    api.get("/admin/overview", { signal })
      .catch(async (error) => {
        if (error.response?.status !== 404) throw error;

        const [statsResponse, usuariosResponse] = await Promise.all([
          api.get("/admin/stats", { signal }),
          api.get("/admin/usuarios", { signal }),
        ]);
        return {
          data: { stats: statsResponse.data, usuarios: usuariosResponse.data },
        };
      })
      .then(({ data }) => {
        setStats(data.stats);
        setUsuarios(data.usuarios);
      })
      .catch((error) => {
        if (error.code !== "ERR_CANCELED") {
          console.error(error);
          setErro("Não foi possível carregar os dados do painel.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false);
      });
    return () => controller.abort();
  }, [tentativa]);

  if (carregando) {
    return <div className="dashboard-feedback" role="status" aria-live="polite">Carregando dados do painel...</div>;
  }

  if (erro) {
    return (
      <div className="dashboard-feedback dashboard-error" role="alert">
        <p>{erro}</p>
        <button type="button" onClick={() => {
          setErro("");
          setCarregando(true);
          setTentativa((valor) => valor + 1);
        }}>Tentar novamente</button>
      </div>
    );
  }

  async function deletarUsuario(id) {
    try {
      await api.delete(`/admin/usuarios/${id}`);

      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));

      setStats((prev) => ({
        ...prev,
        usuarios: prev.usuarios - 1,
      }));
      toast.success("Usuario deletado com sucesso!");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="comeco">
        <span className="adh">Bem Vindo Chefe</span>
        <h1>Dashboard de vizualização geral do projeto</h1>
      </div>

      <div className="container-info">
        <div className="status-cards">
          <div className="card-status">
            <span> Usuários</span>
            <h2>{stats.usuarios}</h2>
          </div>

          <div className="card-status">
            <span> Chamados</span>
            <h2>{stats.chamados}</h2>
          </div>

          <div className="card-status">
            <span> Abertos</span>
            <h2>{stats.abertos}</h2>
          </div>

          <div className="card-status">
            <span> Em andamento</span>
            <h2>{stats.andamento}</h2>
          </div>

          <div className="card-status">
            <span> Resolvidos</span>
            <h2>{stats.resolvidos}</h2>
          </div>
        </div>

        <div className="grafico">
          <h3>Taxa de resolução:</h3>

          <ResponsiveContainer width="100%" height={300} className="pizza">
            <PieChart>
              <Pie
                data={dadosGrafico} //dados
                cx="50%" //posição x
                cy="50%" //posição y
                innerRadius={60} //furo interno para fazer o grafico em rosquinha
                outerRadius={100} //tamanho do grafico
                dataKey="value" //valor numérico
                nameKey="name" //valor ao redor das fatias
                label
              >
                {dadosGrafico.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <h3>Usuarios com mais chamados abertos:</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={usuarios} layout="vertical">
              {/* linhas de fundo */}
              <CartesianGrid strokeDasharray="3 3" />

              {/* eixo horizontal */}
              <XAxis type="number" />

              {/* eixo vertical */}
              <YAxis type="category" dataKey="user" />

              {/* tooltip ao passar mouse */}
              <Tooltip />

              {/* barra usando quantidade de chamados */}
              <Bar dataKey="chamados" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="tabela">
          <table>
            <caption>Gerenciamento de Usuários e Chamados</caption>

            <thead>
              <tr>
                <th>Usuário</th>
                <th>Cargo</th>
                <th>Chamados</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario) => {
                const cargo = String(usuario.role || "").trim().toLowerCase().replace(/\s+/g, "");
                const protegido = usuario.user === "castro" || cargo === "superadmin";

                return (
                <tr key={usuario.id}>
                  <td>{usuario.user}</td>
                  <td>{usuario.role}</td>
                  <td>
                    <span>{usuario.chamados}</span>
                  </td>

                  <td>
                    {protegido ? (
                      <span className="protegido">🔒 Protegido</span>
                    ) : usuarioLogado?.role === "superadmin" ? (
                      <button
                        type="button"
                        className="btn-excluir"
                        onClick={() => deletarUsuario(usuario.id)}
                      >
                        Excluir
                      </button>
                    ) : (
                      <span className="protegido">Sem permissão</span>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
