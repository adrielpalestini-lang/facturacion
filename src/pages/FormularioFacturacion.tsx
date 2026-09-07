import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { billingFormSchema, type BillingFormValues } from '../schemas/billing.schema';
import { getSaleDetail, createBillingRequest } from '../api/billing';
import SaleSummary from '../components/SaleSummary';
import CfdiSelect from '../components/CfdiSelect';
import AddressFields from '../components/AddressFields';

export default function FormularioFacturacion() {
  const { saleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialSale = location.state?.sale;

  const [saleDetail, setSaleDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BillingFormValues>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: { persona_tipo: 'fisica' },
  });

  const personaTipo = watch('persona_tipo');

  useEffect(() => {
    if (!saleId) return;
    getSaleDetail(Number(saleId))
      .then(setSaleDetail)
      .catch(() => navigate('/'))
      .finally(() => setLoadingDetail(false));
  }, [saleId, navigate]);

  const onSubmit = async (values: BillingFormValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await createBillingRequest({ ...values, sale_id: Number(saleId) });
      navigate('/confirmacion');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDetail) return <p>Cargando datos de la venta...</p>;
  if (!saleDetail) return null;

  return (
    <div className="billing-form">
      <h1>Solicitud de factura — Folio {saleId}</h1>

      <SaleSummary
        orgName={saleDetail.sale.org_name}
        items={saleDetail.items}
        total={saleDetail.sale.total}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <legend>Tipo de contribuyente</legend>
          <label>
            <input type="radio" value="fisica" {...register('persona_tipo')} /> Persona física
          </label>
          <label>
            <input type="radio" value="moral" {...register('persona_tipo')} /> Persona moral
          </label>
        </fieldset>

        {personaTipo === 'fisica' ? (
          <fieldset>
            <legend>Datos del contribuyente</legend>
            <label>
              Nombre(s)
              <input {...register('nombre')} />
              {errors.nombre && <span className="error">{errors.nombre.message}</span>}
            </label>
            <label>
              Apellido paterno
              <input {...register('apellido_paterno')} />
              {errors.apellido_paterno && <span className="error">{errors.apellido_paterno.message}</span>}
            </label>
            <label>
              Apellido materno (opcional)
              <input {...register('apellido_materno')} />
            </label>
          </fieldset>
        ) : (
          <fieldset>
            <legend>Datos de la empresa</legend>
            <label>
              Razón social
              <input {...register('business_name')} />
              {errors.business_name && <span className="error">{errors.business_name.message}</span>}
            </label>
          </fieldset>
        )}

        <label>
          RFC
          <input {...register('rfc')} style={{ textTransform: 'uppercase' }} />
          {errors.rfc && <span className="error">{errors.rfc.message}</span>}
        </label>

        <AddressFields register={register} errors={errors} />

        <CfdiSelect register={register} error={errors.uso_cfdi?.message} />

        <fieldset>
          <legend>Datos de contacto</legend>
          <label>
            Correo electrónico
            <input type="email" {...register('customer_email')} />
            {errors.customer_email && <span className="error">{errors.customer_email.message}</span>}
          </label>
          <label>
            Teléfono
            <input {...register('telefono')} maxLength={10} />
            {errors.telefono && <span className="error">{errors.telefono.message}</span>}
          </label>
        </fieldset>

        {submitError && <div className="alert alert-error">{submitError}</div>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Enviando...' : 'Solicitar factura'}
        </button>
      </form>
    </div>
  );
}