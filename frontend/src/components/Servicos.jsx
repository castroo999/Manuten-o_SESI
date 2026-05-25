import "./Servicos.css";
import { Link } from "react-router-dom";
import img from "../assets/img-header.png";

export default function Servicos() {
  const servicos = [
    { id: 1, img: img, descricao: "Serviço 1" },
    { id: 2, img: img, descricao: "Serviço 2" },
    { id: 3, img: img, descricao: "Serviço 3" },
    { id: 4, img: img, descricao: "Serviço 4" },
    { id: 5, img: img, descricao: "Serviço 5" },
    { id: 6, img: img, descricao: "Serviço 6" },
    { id: 7, img: img, descricao: "Serviço 7" },
  ];

  return (
    <div className="tudo">
      <h1>Nossos Serviços</h1>

      <div className="cards2">
        {servicos.map((item) => (
          <div className="card2" key={item.id}>
            <img src={img} alt="serviço" />
            <p>{item.descricao}</p>
          </div>
        ))}
      </div>

      <Link to="/orcamentos">
        <button>Faça seu orçamento aqui!</button>
      </Link>
    </div>
  );
}
