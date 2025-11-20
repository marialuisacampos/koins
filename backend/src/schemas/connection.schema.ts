import { z } from 'zod';

export const sendInviteSchema = z.object({
  partnerEmail: z
    .string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
});

export const connectionIdParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export type SendInviteInput = z.infer<typeof sendInviteSchema>;
export type ConnectionIdParam = z.infer<typeof connectionIdParamSchema>;

