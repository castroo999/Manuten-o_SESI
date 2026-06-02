import "./Cadastro.css";
import api from "../services/Api.js";
import { useState } from "react";
import { toast } from "react-toastify";


export default function Cadastro() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [loading, setLoading] = useState(false);


  async function enviar(e) {
    e.preventDefault();

    //alerta e nao deixa ficar campo sem ser preenchido
    if (!titulo || !descricao || !local || !prioridade) {
      toast.warning("Preencha todos os campos!");
      return;
    }else{
      toast.success("Chamado aberto com sucesso!");

    }

    setLoading(true);

    try {
      //pega dados da api
      await api.post("/chamados", {
        titulo,
        descricao,
        local,
        prioridade,
      });

      setTitulo("");
      setDescricao("");
      setLocal("");
      setPrioridade("");
      
    } catch (error) {
      console.error(error);
      toast.warning("Erro ao abrir chamado");
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
    </section>
  );
}
