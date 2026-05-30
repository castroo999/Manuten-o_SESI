import "./Modelos.css";
import api from "../services/Api";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function Modelos() {
  const [title, setTitle] = useState("");
  const [itens, setItens] = useState([]);
  const [nomeItem, setNomeItem] = useState("");
  const [precoItem, setPrecoItem] = useState("");
  const [modelos, setModelos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [cliente, setCliente] = useState("");
  const [tel, setTel] = useState("");
  const total = itens.reduce((acc, item) => acc + Number(item.preco), 0);

  function abrirEdicao(modelo) {
    setEditandoId(modelo.id);
    setTitle(modelo.title);
    setItens(modelo.itens);
    setCliente(modelo.cliente || "");
    setTel(modelo.tel || "");
  }

  useEffect(() => {
    async function carregarModelos() {
      try {
        const response = await api.get("/modelos");
        setModelos(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    carregarModelos();
  }, []);

  async function deletarModelo(id) {
    try {
      await api.delete(`/modelos/${id}`);
      setModelos((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.log(error);
      alert("Erro ao deletar modelo");
    }
  }

  function gerarPdfEEnviarZap(modelo) {
    if (!modelo.tel) return alert("Numero invalido");

    const numero = modelo.tel.replace(/\D/g, "");
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(modelo.title, 10, 10);

    doc.setFontSize(12);
    doc.text(`Cliente: ${modelo.cliente}`, 10, 20);

    let y = 30;

    modelo.itens.forEach((item) => {
      doc.text(`${item.nome} - R$${item.preco}`, 10, y);
      y += 8;
    });

    const totalModelo = modelo.itens.reduce(
      (acc, item) => acc + Number(item.preco),
      0,
    );

    doc.text(`TOTAL: R$ ${totalModelo}`, 10, y + 10);
    doc.save(`${modelo.title}.pdf`);

    const msg = `Ola ${modelo.cliente}, tudo bem? Seu orcamento esta pronto! Vou te enviar o PDF aqui.`;
    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(msg)}`;

    window.open(url, "_blank");
  }

  async function salvarComoCopia(modelo) {
    try {
      const response = await api.post("/modelos", {
        title: `${modelo.title} (copia)`,
        itens: modelo.itens,
        cliente: modelo.cliente,
        tel: modelo.tel,
      });

      setModelos((prev) => [
        ...prev,
        {
          id: response.data.id,
          title: `${modelo.title} (copia)`,
          itens: modelo.itens,
          cliente: modelo.cliente,
          tel: modelo.tel,
        },
      ]);

      alert("Modelo duplicado com sucesso!");
    } catch (error) {
      console.log(error);
      alert("Erro ao duplicar modelo");
    }
  }

  function addItem() {
    if (!nomeItem || !precoItem) return;

    setItens([
      ...itens,
      {
        nome: nomeItem,
        preco: precoItem,
      },
    ]);

    setNomeItem("");
    setPrecoItem("");
  }

  async function modelo(e) {
    e.preventDefault();

    try {
      if (editandoId) {
        await api.put(`/modelos/${editandoId}`, {
          title,
          itens,
          cliente,
          tel,
        });

        setModelos((prev) =>
          prev.map((m) =>
            m.id === editandoId ? { ...m, title, itens, cliente, tel } : m,
          ),
        );

        alert("Modelo atualizado!");
        setEditandoId(null);
      } else {
        const response = await api.post("/modelos", {
          title,
          itens,
          cliente,
          tel,
        });

        setModelos((prev) => [
          ...prev,
          {
            id: response.data.id,
            title,
            itens,
            cliente,
            tel,
          },
        ]);

        alert("Modelo criado com sucesso!");
      }

      setTitle("");
      setItens([]);
      setCliente("");
      setTel("");
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar modelo");
    }
  }

  return (
    <section className="models-page">
      <div className="models-heading">
        <span>Modelos</span>
        <h1>Orcamentos salvos</h1>
        <p>Crie, duplique e envie modelos de orcamento por WhatsApp.</p>
      </div>

      <div className="models-layout">
        <form className="model-form" onSubmit={modelo}>
          <h2>{editandoId ? "Editar modelo" : "Criar modelo"}</h2>

          <input
            placeholder="Titulo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="model-inline">
            <input
              placeholder="Item"
              value={nomeItem}
              onChange={(e) => setNomeItem(e.target.value)}
            />

            <input
              placeholder="Preco"
              value={precoItem}
              onChange={(e) => setPrecoItem(e.target.value)}
            />
          </div>

          <input
            placeholder="Nome do cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />

          <input
            placeholder="Telefone"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />

          <button type="button" onClick={addItem}>
            Adicionar item
          </button>

          <ul className="itens">
            {itens.map((item, index) => (
              <li key={item.nome + index}>
                {item.nome} - R${item.preco}
              </li>
            ))}
          </ul>

          <div className="total">Total: R$ {total}</div>

          <button type="submit">
            {editandoId ? "Atualizar modelo" : "Salvar modelo"}
          </button>
        </form>

        <div className="lista-modelos">
          <h2>Modelos salvos</h2>

          {modelos.map((modelo) => (
            <article key={modelo.id} className="card-modelo">
              <h3>{modelo.title}</h3>

              <p>
                <strong>Cliente:</strong> {modelo.cliente}
              </p>
              <p>
                <strong>Tel:</strong> {modelo.tel}
              </p>

              <ul>
                {modelo.itens.map((item, index) => (
                  <li key={item.nome + index}>
                    {item.nome} - R${item.preco}
                  </li>
                ))}
              </ul>

              <div className="botoes-modelo">
                <button type="button" onClick={() => abrirEdicao(modelo)}>
                  Editar
                </button>

                <button type="button" onClick={() => salvarComoCopia(modelo)}>
                  Salvar como copia
                </button>

                <button
                  type="button"
                  className="pdf"
                  onClick={() => gerarPdfEEnviarZap(modelo)}
                >
                  Enviar PDF
                </button>

                <button
                  type="button"
                  className="btn-deletar"
                  onClick={() => deletarModelo(modelo.id)}
                >
                  Deletar
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
