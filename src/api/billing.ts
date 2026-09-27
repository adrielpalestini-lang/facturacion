import { apiFetch } from './client';

export interface SaleVerifyResponse {
  sale_id: number;
  total: number;
  org_name: string;
}

export interface CfdiUsage {
  code: string;
  description: string;
}

export function verifySale(folio: string, fecha: string, hora: string, codigo: string) {
  const params = new URLSearchParams({ folio, fecha, hora, codigo });
  return apiFetch<SaleVerifyResponse>(`/api/billing/verify?${params.toString()}`);
}

export function getCfdiUsageCatalog() {
  return apiFetch<CfdiUsage[]>('/api/cfdi-usage');
}

export function getSaleDetail(saleId: number) {
  return apiFetch<any>(`/api/sales/${saleId}/detail`);
}

export interface BillingRequestPayload {
  sale_id: number;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  persona_tipo: 'fisica' | 'moral';
  rfc: string;
  business_name?: string;
  calle: string;
  numero_ext: string;
  numero_int?: string;
  colonia: string;
  ciudad: string;
  estado: string;
  zip_code: string;
  uso_cfdi: string;
  customer_email: string;
  telefono: string;
}

export function createBillingRequest(payload: BillingRequestPayload) {
  return apiFetch<{ success: boolean; id: number }>('/api/billing', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}