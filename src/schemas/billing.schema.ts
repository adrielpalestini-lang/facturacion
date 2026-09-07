import { z } from 'zod';

const rfcFisicaRegex = /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/;
const rfcMoralRegex = /^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$/;

export const verifyFolioSchema = z.object({
  folio: z.string().min(1, 'El folio es obligatorio'),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
});

export const billingFormSchema = z
  .object({
    persona_tipo: z.enum(['fisica', 'moral']),
    nombre: z.string().optional(),
    apellido_paterno: z.string().optional(),
    apellido_materno: z.string().optional(),
    business_name: z.string().optional(),
    rfc: z.string().min(1, 'El RFC es obligatorio').toUpperCase(),
    calle: z.string().min(1, 'La calle es obligatoria'),
    numero_ext: z.string().min(1, 'El número exterior es obligatorio'),
    numero_int: z.string().optional(),
    colonia: z.string().min(1, 'La colonia es obligatoria'),
    ciudad: z.string().min(1, 'La ciudad es obligatoria'),
    estado: z.string().min(1, 'El estado es obligatorio'),
    zip_code: z
      .string()
      .length(5, 'El código postal debe tener 5 dígitos')
      .regex(/^\d+$/, 'Solo números'),
    uso_cfdi: z.string().min(1, 'Selecciona un uso de CFDI'),
    customer_email: z.string().email('Correo inválido'),
    telefono: z
      .string()
      .min(10, 'El teléfono debe tener 10 dígitos')
      .max(10, 'El teléfono debe tener 10 dígitos'),
  })
  .superRefine((data, ctx) => {
    if (data.persona_tipo === 'fisica') {
      if (!data.nombre) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['nombre'], message: 'El nombre es obligatorio' });
      }
      if (!data.apellido_paterno) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['apellido_paterno'], message: 'El apellido paterno es obligatorio' });
      }
      if (!rfcFisicaRegex.test(data.rfc)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['rfc'], message: 'RFC de persona física inválido (13 caracteres)' });
      }
    } else {
      if (!data.business_name) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['business_name'], message: 'La razón social es obligatoria' });
      }
      if (!rfcMoralRegex.test(data.rfc)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['rfc'], message: 'RFC de persona moral inválido (12 caracteres)' });
      }
    }
  });

export type BillingFormValues = z.infer<typeof billingFormSchema>;
export type VerifyFolioValues = z.infer<typeof verifyFolioSchema>;