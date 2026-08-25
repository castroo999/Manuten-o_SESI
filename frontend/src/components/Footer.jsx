import "./Footer.css";
import { FaInstagram } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-comeco">
          <h2>
            SESI<span>TECH</span>
          </h2>
          <p>Gestão de manutenção escolar para ambientes mais organizados.</p>
        </div>

        <div className="footer-column">
          <h3>Atendimento</h3>

          <a href="mailto:GSTR@gmail.com" className="footer-link">
            <MdEmail size={20} />
            GSTR@gmail.com
          </a>

          
        </div>
        <div className="footer-column">
          <h3>Contatos</h3>

          <a
            href="https://instagram.com/GSTR.dev"
            className="footer-link instagram-hover"
          >
            <FaInstagram size={20} />
            @GSTR.dev
          </a>

          <a
            href="https://wa.me/5515996485913"
            className="footer-link whatsapp-hover"
          >
            <FaWhatsapp size={20} />
            (15) 99648-5913
          </a>
        </div>
      </div>

      {/* Direitos Reservados */}
      <div className="footer-bottom">
        <p>&copy; 2026 SESI-tech. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
