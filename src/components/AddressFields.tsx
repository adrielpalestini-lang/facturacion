import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { BillingFormValues } from '../schemas/billing.schema';

interface AddressFieldsProps {
  register: UseFormRegister<BillingFormValues>;
  errors: FieldErrors<BillingFormValues>;
}

export default function AddressFields({ register, errors }: AddressFieldsProps) {
  return (
    <fieldset>
      <legend>Dirección fiscal</legend>

      <label>
        Calle
        <input {...register('calle')} />
        {errors.calle && <span className="error">{errors.calle.message}</span>}
      </label>

      <div className="row">
        <label>
          Número exterior
          <input {...register('numero_ext')} />
          {errors.numero_ext && <span className="error">{errors.numero_ext.message}</span>}
        </label>
        <label>
          Número interior (opcional)
          <input {...register('numero_int')} />
        </label>
      </div>

      <label>
        Colonia
        <input {...register('colonia')} />
        {errors.colonia && <span className="error">{errors.colonia.message}</span>}
      </label>

      <div className="row">
        <label>
          Código postal
          <input {...register('zip_code')} maxLength={5} />
          {errors.zip_code && <span className="error">{errors.zip_code.message}</span>}
        </label>
        <label>
          Ciudad
          <input {...register('ciudad')} />
          {errors.ciudad && <span className="error">{errors.ciudad.message}</span>}
        </label>
        <label>
          Estado
          <input {...register('estado')} />
          {errors.estado && <span className="error">{errors.estado.message}</span>}
        </label>
      </div>
    </fieldset>
  );
}