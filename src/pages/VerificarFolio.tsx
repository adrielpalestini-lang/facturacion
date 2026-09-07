import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { verifyFolioSchema, type VerifyFolioValues } from '../schemas/billing.schema';
import { verifySale } from '../api/billing';
import { useState } from 'react';

export default function VerificarFolio() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFolioValues>({ resolver: zodResolver(verifyFolioSchema) });

  const onSubmit = async (values: VerifyFolioValues) => {
    setServerError(null);
    setLoading(true);
    try {
      const sale = await verifySale(values.folio, values.fecha);
      navigate(`/facturar/${sale.sale_id}`, { state: { sale } });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-folio">
      <h1>Portal de Facturación — Tiendita de Guadalajara</h1>
      <p>Ingresa el folio de tu ticket y la fecha de compra para continuar.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Folio de venta
          <input {...register('folio')} placeholder="Ej. 1024" />
          {errors.folio && <span className="error">{errors.folio.message}</span>}
        </label>

        <label>
          Fecha de compra
          <input type="date" {...register('fecha')} />
          {errors.fecha && <span className="error">{errors.fecha.message}</span>}
        </label>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Verificando...' : 'Verificar'}
        </button>
      </form>
    </div>
  );
}