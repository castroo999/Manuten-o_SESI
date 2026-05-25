import "./VerServico.css";
import { useEffect, useState } from "react";
import { FaRegSmile } from "react-icons/fa";
import { CgSmileNeutral } from "react-icons/cg";
import { ImAngry } from "react-icons/im";
import api from "../services/Api";

export default function VerServico() {
  const usuarioLogado = JSON.parse(localStorage.getItem("user"));
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

  // filtro
  const chamadosFiltrados = chamados.filter((item) => {
    const texto = filtro.toLowerCase();

    return (
      item.titulo.toLowerCase().includes(texto) ||
      item.local.toLowerCase().includes(texto) ||
      item.status.toLowerCase().includes(texto)
    );
  });

  // carregar chamados
  useEffect(() => {
    async function carregarChamados() {
      try {
        const response = await api.get("/chamados", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setChamados(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
      }
    }

    carregarChamados();
  }, [token]);

  // deletar
  async function deletar(id) {
    try {
      await api.delete(`/chamados/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChamados((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);

      alert("Erro ao deletar chamado");
    }
  }

  // abrir modal
  function abrirModal(item) {
    setEditandoId(item.id);

    setTitulo(item.titulo);

    setDescricao(item.descricao);

    setLocal(item.local);

    setPrioridade(item.prioridade);

    setStatus(item.status);

    setModalAberto(true);
  }

  // fechar modal
  function fecharModal() {
    setModalAberto(false);

    setModalDeletar(false);

    setModalSucessoEditar(false);

    setEditandoId(null);
  }

  // editar chamado
  async function editar() {
    try {
      await api.put(
        `/chamados/${editandoId}`,
        {
          titulo,
          descricao,
          local,
          prioridade,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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
    <div className="container2">
      <div className="listados">
        {usuarioLogado?.role === "admin" && (
          <input
            type="text"
            className="filtro"
            placeholder="Filtrar chamados..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        )}

        <span>Chamados Registrados</span>

        <ul>
          {chamadosFiltrados.map((item) => (
            <li key={item.id} className={item.status}>
              <h3>TÍTULO: {item.titulo}</h3>

              <p>
                <strong>DESCRIÇÃO:</strong> {item.descricao}
              </p>

              <p>
                <strong>LOCAL:</strong> {item.local}
              </p>

              <p className="prioridade-box">
                <strong>PRIORIDADE:</strong>

                {item.prioridade === "baixa" && (
                  <>
                    <FaRegSmile color="green" size={28} />
                    <span>Baixa</span>
                  </>
                )}

                {item.prioridade === "media" && (
                  <>
                    <CgSmileNeutral color="yellow" size={38} />
                    <span>Média</span>
                  </>
                )}

                {item.prioridade === "alta" && (
                  <>
                    <ImAngry color="red" size={28} />
                    <span>Alta</span>
                  </>
                )}
              </p>

              <p>
                <strong>DATA:</strong>{" "}
                {new Date(item.criado_em).toLocaleString("pt-BR")}
              </p>

              <p>
                <strong>STATUS:</strong>

                <span className={`status ${item.status}`}>{item.status}</span>
              </p>

              <div className="botoes">
                {usuarioLogado?.role === "admin" && (
                  <button onClick={() => abrirModal(item)}>Editar</button>
                )}

                {usuarioLogado?.role === "admin" && (
                  <button
                    onClick={() => {
                      setIdParaDeletar(item.id);

                      setModalDeletar(true);
                    }}
                  >
                    Deletar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {modalDeletar && (
          <div className="overlay4" onClick={fecharModal}>
            <div className="modal3" onClick={(e) => e.stopPropagation()}>
              <div className="certeza">
                <h3>Deseja realmente deletar este chamado?</h3>

                <div className="botoes">
                  <button
                    onClick={() => {
                      deletar(idParaDeletar);

                      fecharModal();
                    }}
                  >
                    Confirmar
                  </button>

                  <button onClick={fecharModal}>Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalSucessoEditar && (
          <div className="overlay4" onClick={fecharModal}>
            <div className="modal3" onClick={(e) => e.stopPropagation()}>
              <h3>Chamado atualizado com sucesso!</h3>

              <button onClick={fecharModal}>Fechar</button>
            </div>
          </div>
        )}

        {modalAberto && (
          <div className="overlay2" onClick={fecharModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Editar Chamado</h2>

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

              <textarea
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                maxLength={500}
              />

              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
              >
                <option value="baixa">Baixa</option>

                <option value="media">Média</option>

                <option value="alta">Alta</option>
              </select>

              <select
                className={status}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="aberto">Aberto</option>

                <option value="em andamento">Em andamento</option>

                <option value="resolvido">Resolvido</option>
              </select>

              <div className="botoes">
                <button onClick={editar}>Salvar</button>

                <button onClick={fecharModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
