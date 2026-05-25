import "./Cadastro.css";
import api from "../services/Api.js";
import { useState } from "react";

export default function Cadastro() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [loading, setLoading] = useState(false);

  function fecharModal() {
    setModalAberto(false);
  }

  async function enviar(e) {
    e.preventDefault();

    if (!titulo || !descricao || !local || !prioridade) {
      alert("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/chamados",
        {
          titulo,
          descricao,
          local,
          prioridade,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setModalAberto(true);

      setTimeout(() => {
        setModalAberto(false);
      }, 5000);

      setTitulo("");
      setDescricao("");
      setLocal("");
      setPrioridade("");
    } catch (error) {
      console.error(error);

      alert("Erro ao abrir chamado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <form onSubmit={enviar}>
        <h1>Abrir Chamado</h1>

        <input
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          placeholder="Local"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
        />

        <select
          value={prioridade}
          onChange={(e) => setPrioridade(e.target.value)}
        >
          <option value="">Selecione prioridade</option>

          <option value="baixa">Baixa</option>

          <option value="media">Média</option>

          <option value="alta">Alta</option>
        </select>

        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          maxLength={500}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Abrir Chamado"}
        </button>
      </form>

      {modalAberto && (
        <div className="overlay3" onClick={fecharModal}>
          <div className="modal2" onClick={(e) => e.stopPropagation()}>
            <div className="alert">
              <h3>Chamado enviado com sucesso!</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
