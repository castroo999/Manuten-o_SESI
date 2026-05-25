import "./CardInicial.css";
import mapa from "../assets/mapa.png";

export default function CardInicial() {
  return (
    <div className="tudo">
      <h1>Mapa da escola</h1>

      <div className="cards">
        <div className="card">
          <img src={mapa} alt="img" />
        </div>
      </div>
    </div>
  );
}
