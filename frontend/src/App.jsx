import { Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroUser from "./pages/CadastroUser";
import Cadastro from "./pages/Cadastro";
import CardInicial from "./components/CardInicial";
import VerChamado from "./pages/VerChamado";
import QuemSomos from "./pages/QuemSomos";

export default function App() {
  return (
    <>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUser />} />
        <Route path="/quem-somos" element={<QuemSomos />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CardInicial />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chamados"
          element={
            <ProtectedRoute>
              <Cadastro />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ver_chamados"
          element={
            <ProtectedRoute>
              <VerChamado />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
    </>
  );
}
