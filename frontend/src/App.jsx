import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroUser from "./pages/CadastroUser";
import Cadastro from "./pages/Cadastro";
import Servicos from "./components/Servicos";
import VerServico from "./pages/VerServico";
import CardInicial from "./components/CardInicial";
import Modelos from "./pages/Modelos";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/cadastro" element={<CadastroUser />} />

        <Route
          path="/modelos"
          element={
            JSON.parse(localStorage.getItem("user"))?.role === "admin" ? (<Modelos />) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard"
          element={token ? <CardInicial /> : <Navigate to="/login" />}
        />

        <Route
          path="/orcamentos"
          element={token ? <Cadastro /> : <Navigate to="/login" />}
        />

        <Route
          path="/servicos"
          element={token ? <Servicos /> : <Navigate to="/login" />}
        />

        <Route
          path="/ver_orcamentos"
          element={token ? <VerServico /> : <Navigate to="/login" />}
        />
      </Routes>

      <Footer />
    </>
  );
}
