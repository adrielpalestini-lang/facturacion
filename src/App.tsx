import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import VerificarFolio from './pages/VerificarFolio';
import FormularioFacturacion from './pages/FormularioFacturacion';
import Confirmacion from './pages/Confirmacion';
import './App.css';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell">
      <header className="storefront-header">
        <div className="storefront-header__ribbon">
          <div className="storefront-header__mark">T</div>
          <h1 className="storefront-header__title">Tiendita de Guadalajara</h1>
        </div>
        <div className="storefront-header__banner">Portal de Facturación</div>
      </header>
      <div className="page-content">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<VerificarFolio />} />
          <Route path="/facturar/:saleId" element={<FormularioFacturacion />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}