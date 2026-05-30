import "./CardInicial.css";
import mapa from "../assets/mapa.png";

export default function CardInicial() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <span>Painel</span>
        <h1>Mapa da escola</h1>
        <p>Use o mapa como referencia para localizar e registrar chamados.</p>
      </div>

      <div className="map-panel">
        <img src={mapa} alt="Mapa da escola" />
      </div>
    </section>
  );
}
