import "./Footer.css";
import { FaInstagram } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <div className="footer">
      <div className="contato">
        <h2>Entre em contato aqui:</h2>

        <div className="contatos">
          <div className="coluna">
            <h3>GSTR</h3>

            <span>
              <MdEmail size={25} /> GSTR@gmail.com
            </span>

              <span>
              <FaInstagram size={25} color="deeppink" />
              @GSTR.dev
            </span>

            <span>
              <FaWhatsapp size={25} color="green" />
              (55) 15 99648-5913
            </span>
          </div>

          <div className="coluna">
            <h3>Inove Serralheria</h3>

            <span>
              <MdEmail size={25} /> inoveserralheria@gmail.com
            </span>

            <span>
              <FaInstagram size={25} color="deeppink" />
              @inove.serralheria.cerquilho
            </span>

            <span>
              <FaWhatsapp size={25} color="green" />
              (55) 15 99700-1378
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
