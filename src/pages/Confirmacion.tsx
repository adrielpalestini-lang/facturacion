import { Link } from 'react-router-dom';

export default function Confirmacion() {
  return (
    <div className="confirmacion">
      <h1>¡Solicitud enviada!</h1>
      <p>
        Tu solicitud de facturación fue recibida correctamente. Te notificaremos por
        correo electrónico cuando tu factura esté lista.
      </p>
      <Link to="/">Solicitar otra factura</Link>
    </div>
  );
}