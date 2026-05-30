import "./QuemSomos.css";
import eu from "../assets/eu.png";
import bigas from "../assets/bigas.png";
import big from "../assets/big.png";

const equipe = [
  {
    nome: "Gustavo Castro",
    cargo: "Desenvolvedor Full Stack do projeto",
    foto: eu,
  },
  {
    nome: "Gabriel Rodrigues",
    cargo: "PO do projeto",
    foto: bigas,
  },
  {
    nome: "Matheus Rozante",
    cargo: "Designer Figma",
    foto: big,
  },
];

export default function QuemSomos() {
  return (
    <section className="about-page">
      <div className="about-hero">
        <span>Sobre o projeto</span>
        <h2>Quem somos?</h2>

        <p>
          A nossa ideia e a continuacao do projeto Plantamatica, uma plataforma
          onde a comunidade do SESI 428 ajuda a equipe de manutencao da escola
          informando problemas, quando ocorreram e a gravidade de cada situacao.
        </p>
      </div>

      <div className="team">
        <div className="team-heading">
          <span>Equipe</span>
          <h1>Dev Manutencao</h1>
        </div>

        <div className="team-cards">
          {equipe.map((pessoa) => (
            <article className="team-card" key={pessoa.nome}>
              <img src={pessoa.foto} alt={pessoa.nome} />
              <h3>{pessoa.nome}</h3>
              <p>{pessoa.cargo}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
