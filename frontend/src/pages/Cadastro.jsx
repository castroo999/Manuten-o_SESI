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
      await api.post("/chamados", {
        titulo,
        descricao,
        local,
        prioridade,
      });

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
    <section className="form-page">
      <form className="formulario" onSubmit={enviar}>
        <div className="form-topo">
          <span>Novo chamado</span>
          <h1>Abrir chamado</h1>
        </div>

        <label>
          Titulo
          <input
            placeholder="Ex: mesa quebrada sala 9"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </label>

        <label>
          Local
          <input
            placeholder="Ex: Bloco 1, sala 3"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />
        </label>

        <label>
          Prioridade
          <select
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
          >
            <option value="">Selecione prioridade</option>
            <option value="baixa">Baixa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </label>

        <label>
          Descricao
          <textarea
            placeholder="Descreva o problema com detalhes"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            maxLength={500}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Abrir chamado"}
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
    </section>
  );
}
