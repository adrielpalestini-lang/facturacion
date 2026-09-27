import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyFolioSchema, type VerifyFolioValues } from '../schemas/billing.schema';
import { verifySale } from '../api/billing';
import { useEffect, useState } from 'react';

export default function VerificarFolio() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoChecking, setAutoChecking] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFolioValues>({
    resolver: zodResolver(verifyFolioSchema),
    defaultValues: {
      folio: searchParams.get('folio') ?? '',
      fecha: searchParams.get('fecha') ?? '',
      hora: searchParams.get('hora') ?? '',
      codigo: searchParams.get('codigo') ?? '',
    },
  });

  const runVerification = async (values: VerifyFolioValues) => {
    setServerError(null);
    setLoading(true);
    try {
      const sale = await verifySale(values.folio, values.fecha, values.hora, values.codigo);
      navigate(`/facturar/${sale.sale_id}`, { state: { sale } });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Si llegan los 4 parámetros por URL (ej. desde un QR del ticket), verificamos de una vez
  useEffect(() => {
    const folio = searchParams.get('folio');
    const fecha = searchParams.get('fecha');
    const hora = searchParams.get('hora');
    const codigo = searchParams.get('codigo');

    if (folio && fecha && hora && codigo) {
      runVerification({ folio, fecha, hora, codigo });
    } else {
      setAutoChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (autoChecking) {
    return (
      <div className="verify-folio">
        <h1>Verificando tu ticket...</h1>
        <p>Un momento por favor.</p>
      </div>
    );
  }

  return (
    <div className="verify-folio">
      <h1>Verifica tu ticket</h1>
      <p>Ingresa los datos de tu ticket para continuar. Los encuentras impresos junto al código.</p>

      <form onSubmit={handleSubmit(runVerification)}>
        <div className="row">
          <label>
            Folio de venta
            <input {...register('folio')} placeholder="Ej. 647" />
            {errors.folio && <span className="error">{errors.folio.message}</span>}
          </label>
          <label>
            Fecha de compra
            <input type="date" {...register('fecha')} />
            {errors.fecha && <span className="error">{errors.fecha.message}</span>}
          </label>
        </div>

        <div className="row">
          <label>
            Hora de compra
            <input type="time" step="1" {...register('hora')} />
            {errors.hora && <span className="error">{errors.hora.message}</span>}
          </label>
          <label>
            Código de seguridad
            <input
              {...register('codigo')}
              placeholder="Ej. A3F9K2XZ"
              style={{ textTransform: 'uppercase' }}
              maxLength={20}
            />
            {errors.codigo && <span className="error">{errors.codigo.message}</span>}
          </label>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Verificando...' : 'Verificar'}
        </button>
      </form>
    </div>
  );
}