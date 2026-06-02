import "./VerChamado.css";
import { useEffect, useState } from "react";
import { FaRegSmile } from "react-icons/fa";
import { CgSmileNeutral } from "react-icons/cg";
import { ImAngry } from "react-icons/im";
import api from "../services/Api";

function getStatusClass(status = "") {
  return status.replace(/\s+/g, "-").toLowerCase();
}

export default function VerChamado() {
  const usuarioLogado = JSON.parse(localStorage.getItem("user") || "null");
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDeletar, setModalDeletar] = useState(false);
  const [modalSucessoEditar, setModalSucessoEditar] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [status, setStatus] = useState("");
  const [idParaDeletar, setIdParaDeletar] = useState(null);
  const [chamados, setChamados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const token = localStorage.getItem("token");

  const chamadosFiltrados = chamados.filter((item) => {
    const texto = filtro.toLowerCase();

    return (
      item.titulo?.toLowerCase().includes(texto) ||
      item.local?.toLowerCase().includes(texto) ||
      item.status?.toLowerCase().includes(texto)
    );
  });

  useEffect(() => {
    async function carregarChamados() {
      try {
        const response = await api.get("/chamados");
        setChamados(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
      }
    }

    carregarChamados();
  }, [token]);

  async function deletar(id) {
    try {
      await api.delete(`/chamados/${id}`);
      setChamados((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
      alert("Erro ao deletar chamado");
    }
  }

  function abrirModal(item) {
    setEditandoId(item.id);
    setTitulo(item.titulo);
    setDescricao(item.descricao);
    setLocal(item.local);
    setPrioridade(item.prioridade);
    setStatus(item.status);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setModalDeletar(false);
    setModalSucessoEditar(false);
    setEditandoId(null);
  }

  async function editar() {
    try {
      await api.put(`/chamados/${editandoId}`, {
        titulo,
        descricao,
        local,
        prioridade,
        status,
      });

      setChamados((prev) =>
        prev.map((item) =>
          item.id === editandoId
            ? {
                ...item,
                titulo,
                descricao,
                local,
                prioridade,
                status,
              }
            : item,
        ),
      );

      fecharModal();
      setModalSucessoEditar(true);
    } catch (error) {
      console.log(error);
      alert("Erro ao editar chamado");
    }
  }

  return (
    <section className="page-chamados">
      <div className="cabeçalho-chamado">
        <span>Atendimento</span>
        <h1>Chamados registrados</h1>
        <p>Acompanhe os problemas informados e atualize o andamento.</p>
      </div>

      {usuarioLogado?.role === "admin" && (
        <input
          type="text"
          className="filtro"
          placeholder="Filtrar por titulo, local ou status"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      )}

      <ul className="chamados">
        {chamadosFiltrados.map((item) => {
          const statusClass = getStatusClass(item.status);

          return (
            <li key={item.id} className={`ticket-card ${statusClass}`}>
              <div className="ticket-top">
                <span className={`status ${statusClass}`}>{item.status}</span>
                <h3>{item.titulo}</h3>
              </div>

              <p>
                <strong>Descricao:</strong> {item.descricao}
              </p>

              <p>
                <strong>Local:</strong> {item.local}
              </p>

              <div className="prioridade-box">
                <strong>Prioridade</strong>

                {item.prioridade === "baixa" && (
                  <>
                    <FaRegSmile color="green" size={28} />
                    <span>Baixa</span>
                  </>
                )}

                {item.prioridade === "media" && (
                  <>
                    <CgSmileNeutral color="#d99b00" size={34} />
                    <span>Media</span>
                  </>
                )}

                {item.prioridade === "alta" && (
                  <>
                    <ImAngry color="red" size={28} />
                    <span>Alta</span>
                  </>
                )}
              </div>

              <p>
                <strong>Data:</strong>{" "}
                {new Date(item.criado_em).toLocaleString("pt-BR")}
              </p>

              {usuarioLogado?.role === "admin" && (
                <div className="botoes">
                  <button type="button" onClick={() => abrirModal(item)}>
                    Editar
                  </button>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => {
                      setIdParaDeletar(item.id);
                      setModalDeletar(true);
                    }}
                  >
                    Deletar
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {chamadosFiltrados.length === 0 && (
        <div className="vazio">Nenhum chamado encontrado.</div>
      )}

      {modalDeletar && (
        <div className="overlay4" onClick={fecharModal}>
          <div className="modal3" onClick={(e) => e.stopPropagation()}>
            <h3>Deseja realmente deletar este chamado?</h3>

            <div className="botoes">
              <button
                type="button"
                onClick={() => {
                  deletar(idParaDeletar);
                  fecharModal();
                }}
              >
                Confirmar
              </button>

              <button type="button" onClick={fecharModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalSucessoEditar && (
        <div className="overlay4" onClick={fecharModal}>
          <div className="modal3" onClick={(e) => e.stopPropagation()}>
            <h3>Chamado atualizado com sucesso!</h3>
            <button type="button" onClick={fecharModal}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {modalAberto && (
        <div className="overlay2" onClick={fecharModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Editar chamado</h2>

            <label>
              Titulo
              <input
                placeholder="Titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </label>

            <label>
              Local
              <input
                placeholder="Local"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
              />
            </label>

            <label>
              Descricao
              <textarea
                placeholder="Descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                maxLength={500}
              />
            </label>

            <label>
              Prioridade
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </label>

            <label>
              Status
              <select
                className={getStatusClass(status)}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="aberto">Aberto</option>
                <option value="em andamento">Em andamento</option>
                <option value="resolvido">Resolvido</option>
              </select>
            </label>

            <div className="botoes">
              <button type="button" onClick={editar}>
                Salvar
              </button>

              <button type="button" onClick={fecharModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
