import { useEffect, useState } from 'react';
import { getCfdiUsageCatalog, type CfdiUsage } from '../api/billing';
import type { UseFormRegister } from 'react-hook-form';
import type { BillingFormValues } from '../schemas/billing.schema';

interface CfdiSelectProps {
  register: UseFormRegister<BillingFormValues>;
  error?: string;
}

export default function CfdiSelect({ register, error }: CfdiSelectProps) {
  const [options, setOptions] = useState<CfdiUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCfdiUsageCatalog()
      .then(setOptions)
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <label>
      Uso de CFDI
      <select {...register('uso_cfdi')} disabled={loading}>
        <option value="">{loading ? 'Cargando...' : 'Selecciona una opción'}</option>
        {options.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.code} — {opt.description}
          </option>
        ))}
      </select>
      {error && <span className="error">{error}</span>}
    </label>
  );
}